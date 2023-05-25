from .database import db
from sqlalchemy import and_
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('timestamp',db.DateTime, default=datetime.utcnow)
)

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    about_author = db.Column(db.Text(), nullable=True,default='None')
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    profile_pic = db.Column(db.String(), nullable=True,default='default_profile_pic.png')
    # fs_uniquifier= db.Column(db.String(255), nullable=True, nullable=False, default=)

    # Do some password stuff!
    password_hash = db.Column(db.String(128))
    # User Can Have Many Posts
    posts = db.relationship('Posts', cascade="all, delete", backref='poster',lazy='dynamic')
    comments = db.relationship('Comment', cascade="all,delete", backref='user', lazy='dynamic')
    likes = db.relationship('Like', cascade="all,delete", backref='user', lazy='dynamic')
    followed = db.relationship(
        'Users', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic',order_by=followers.c.timestamp)

    def get_all_users():
        return [Users.json(user) for user in Users.query.all()]

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)


    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)

    def is_following(self, user):
        return self.followed.filter(
            followers.c.followed_id == user.id).count() > 0

    def followed_posts(self):
        followed = Posts.query.join(
            followers, (followers.c.followed_id == Posts.poster_id)).filter(
                followers.c.follower_id == self.id)
        own = Posts.query.filter_by(poster_id=self.id)
        return followed.union(own).order_by(Posts.timestamp.desc())
        # return followed.order_by(Posts.timestamp.desc())

    def followers_func(self):
        followerss = Users.query.join(
            followers, (followers.c.follower_id == Users.id)).filter(
                followers.c.followed_id == self.id)
        return followerss.order_by(followers.timestamp.desc())

    def __repr__(self):
        return '<Name %r>' % self.name


# Create a Blog Post model

class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    slug = db.Column(db.String(255))
    thumbnail = db.Column(db.String(255), default='default_thumbnail.jpg')
    poster_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), nullable=False)
    comments = db.relationship('Comment', cascade="all,delete", backref='post')
    likes = db.relationship('Like', cascade="all,delete", backref='post')

# Comment Model


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    author = db.Column(db.Integer, db.ForeignKey(
        'users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(
        'posts.id'), nullable=False)


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    author = db.Column(db.Integer, db.ForeignKey(
        'users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(
        'posts.id'), nullable=False)