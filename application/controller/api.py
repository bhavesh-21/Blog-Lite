from flask_restful import Resource, Api
from flask_restful import fields, marshal_with
from flask_restful import reqparse
from application.utils.validation import *
from application.data.models import *
from application.data.database import db
from flask import current_app as app
from flask import jsonify,request
import werkzeug
from flask import abort
from sqlalchemy import and_
from werkzeug.utils import secure_filename
import uuid as uuid
import os
from werkzeug.datastructures import FileStorage
from flask_jwt_extended import jwt_required
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_current_user
from flask_jwt_extended import  verify_jwt_in_request
from flask_jwt_extended import JWTManager
import base64
from application.data.data_access import *
from application.controller.controllers import current_user
def base(picc,ifpic=False):
    if ifpic==True:
        x=app.config['PIC_FOLDER']
        data="data:image/png;base64,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"
    else:
        x=app.config['POST_FOLDER']
    pic =x +"/"+ picc
    
    try:
        with open(pic, "rb") as f:
            data = f.read()
        data = "data:image/png;base64,"+base64.b64encode(data).decode("UTF-8")
    except:
        pass
    return data

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument('name', type=str, help="name Required",required=True)
create_user_parser.add_argument('username', type=str, help="username Required",required=True)
create_user_parser.add_argument('email', type=str, help="email Required",required=True)
create_user_parser.add_argument('password', type=str, help="password Required",required=True)
create_user_parser.add_argument('about', type=str, help="about Required")

update_user_parser = reqparse.RequestParser()
update_user_parser.add_argument('name', type=str, help="name of user")
update_user_parser.add_argument('username', type=str, help="username of user")
update_user_parser.add_argument('email', type=str, help="email of user")
update_user_parser.add_argument('password', type=str, help="password of user")
update_user_parser.add_argument('about', type=str, help="about of user")


resource_fields = {
    'id' :  fields.Integer,
    'f1' :  fields.Integer,
    'f2' :  fields.Integer,
    'following' :  fields.Boolean,
    'username':    fields.String, 
    'name' :    fields.String,
    'email' :    fields.String,
    'about_author':    fields.String,
    'last_login': fields.String,
    'profile_pic':    fields.String,
}

class Search_User(Resource):
    @marshal_with(resource_fields)
    @jwt_required()
    def get(self):
        current_user=m()
        query=request.args.get('query')
        users = Users.query.filter(and_(Users.email != current_user.email, Users.name.like('%' + query + '%')))
        user = users.order_by(Users.name).all()
        for u in user:
            
            u.profile_pic=base(u.profile_pic,True)
            u.f1 = u.followers.count()
            u.f2 = u.followed.count()
            if (current_user.is_following(u)):
                u.following=True
            else:
                u.following=False
        if user is None:
            raise NotFoundError(status_code=404)
        return user



class User_all(Resource):
    @marshal_with(resource_fields)
    @jwt_required()
    def get(self):
        user = Users.query.all()
        current_user=m()
        for u in user:
            u.profile_pic=base(u.profile_pic,True)
            u.f1 = u.followers.count()
            u.f2 = u.followed.count()
            if (current_user.is_following(u)):
                u.following=True
            else:
                u.following=False
        if user is None:
            raise NotFoundError(status_code=404)
        return user

    @marshal_with(resource_fields)
    def post(self):
        args = create_user_parser.parse_args()
        username = args["username"]
        email = args["email"]
        name = args["name"]
        password = args["password"]
        about_author = args["about"]

        if username is None:
            raise UserValidationError(status_code=400, error_code="USR001", error_message="username is required")

        if email is None:
            raise UserValidationError(status_code=400, error_code="USR002", error_message="email is required")

        if "@" in email:
            pass
        else:
            raise UserValidationError(status_code=400, error_code="USR003", error_message="Invalid email")

        user = us(username)
        if user is not None:
            raise UserValidationError(status_code=400, error_code="USR004", error_message='Username Already Occupied.')

        user = Users.query.filter_by(email=email).first()
        if user is not None:
            raise UserValidationError(status_code=400, error_code="USR005", error_message='Please use a different email address.')

        user = Users.query.filter(and_(Users.username==username,Users.email==email))
        if user is None:
            raise AlreadyExistError(status_code=409)
        
        user = Users(name=name,username=username, email=email,about_author=about_author)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return user, 201       

class User(Resource):
    @marshal_with(resource_fields)
    @jwt_required()
    def get(self, username):
        current_user=m()
        u = us(username)
        u.profile_pic=base(u.profile_pic,True)
        u.f1 = u.followers.count()
        u.f2 = u.followed.count()
        if (current_user.is_following(u)):
            u.following=True
        else:
            u.following=False
        if u is None:
            raise NotFoundError(status_code=404)
        return u
        
    @marshal_with(resource_fields)
    def put(self, username):
        args = update_user_parser.parse_args()
        userp = us(username)
        if userp is None:
            raise NotFoundError(status_code=404)

        user = Users.query.filter(and_(Users.username==args.get("username"),Users.username!=username)).first()
        if user is not None:
            raise UserValidationError(status_code=400, error_code="USR004", error_message='Username Already Occupied.')

        user = Users.query.filter(and_(Users.email==args.get("email"),Users.email!=userp.email)).first()
        if user is not None:
            raise UserValidationError(status_code=400, error_code="USR005", error_message='Please use a different email address.')
        
        if args.get("username"):
            userp.username = args.get("username")
        if args.get("email"):
            if '@' in args.get("email"):
                userp.email = args.get("email")
            else:
                raise UserValidationError(status_code=400, error_code="USR003", error_message="Invalid email")
            
        if args.get("name"):
            userp.name = args.get("name")
        if args.get("password"):
            userp.password = args.get("password")
        if args.get("about"):
            userp.about_author = args.get("about")
        db.session.commit()
        return userp       
    @jwt_required()
    def delete(self, username):
        user = us(username)
        if user is None:
            raise NotFoundError(status_code=404)
        db.session.delete(user)
        db.session.commit()
        return ''    

class Myfollowers(Resource):
    @marshal_with(resource_fields)
    @jwt_required()
    def get(self,username):
        current_user=m()
        if current_user.username == username:
            user=current_user.followers.all()
            for u in user:
                u.profile_pic=base(u.profile_pic,True)
                u.f1 = u.followers.count()
                u.f2 = u.followed.count()
                if (current_user.is_following(u)):
                    u.following=True
                else:
                    u.following=False
            if user is None:
                raise NotFoundError(status_code=404)
            return user
        else:
            return {"error":"cannot view others followers"}


class Myfollowing(Resource):
    @marshal_with(resource_fields)
    @jwt_required()
    def get(self,username):
        current_user=m()
        if current_user.username == username:
            user=current_user.followed.all()
            for u in user:
                u.profile_pic=base(u.profile_pic,True)
                u.f1 = u.followers.count()
                u.f2 = u.followed.count()
                if (current_user.is_following(u)):
                    u.following=True
                else:
                    u.following=False
            if user is None:
                raise NotFoundError(status_code=404)
            return user
        else:
            return {"error":"cannot view others following"}


    
    
   
    

create_post_parser = reqparse.RequestParser()
create_post_parser.add_argument('title', type=str, help="title Required",required=True)
create_post_parser.add_argument('content', type=str, help="content Required",required=True)
create_post_parser.add_argument('slug', type=str, help="slug Required",required=True)

update_post_parser = reqparse.RequestParser()
update_post_parser.add_argument('title', type=str, help="title of post")
update_post_parser.add_argument('content', type=str, help="content of post")
update_post_parser.add_argument('slug', type=str, help="slug of post")



post_fields = {
    'id' :  fields.Integer,
    'lik' :  fields.Integer,
    'liked' :  fields.Boolean,
    'commen' :  fields.Integer,
    'title':    fields.String, 
    'content' :    fields.String,
    'timestamp' :    fields.String,
    'slug':    fields.String,
    'thumbnail': fields.String,
    'poster_id' :  fields.Integer,
    'poster':fields.Nested(resource_fields)
}

class Feed(Resource):
    @marshal_with(post_fields)
    @jwt_required()
    def get(self):  
        current_user=m() 
        posts = current_user.followed_posts().all()
        # posts = Posts.query.filter_by(poster_id=current_user.id).all()
        for p in posts:
            p.thumbnail=base(p.thumbnail)
            p.lik=len(p.likes)
            p.commen=len(p.comments)
            # u=p.poster.username
            p.liked=bool(Like.query.filter(and_(Like.author==current_user.id,Like.post_id==p.id)).first())
            p.poster.profile_pic=base(p.poster.profile_pic,True)
        return posts

        
class SearchFeed(Resource):
    @marshal_with(post_fields)
    @jwt_required()
    def get(self):  
        query=request.args.get('query')
        current_user=m()  
        posts = current_user.followed_posts().filter(Posts.title.like('%' + query + '%')).all()
        # posts = posts.filter_by(posts.title.like('%' + query + '%'))
        # posts = Posts.query.filter_by(poster_id=current_user.id).all()
        for p in posts:
            p.thumbnail=base(p.thumbnail)
            p.lik=len(p.likes)
            p.commen=len(p.comments)
            # u=p.poster.username
            p.liked=bool(Like.query.filter(and_(Like.author==current_user.id,Like.post_id==p.id)).first())
            p.poster.profile_pic=base(p.poster.profile_pic,True)
        return posts

class Myposts(Resource):
    @marshal_with(post_fields)
    @jwt_required()
    def get(self):  
        id=request.args.get('id') 
        current_user=m()  
        posts = Posts.query.filter_by(poster_id=id).all()
        # posts = current_user.followed_posts().all()
        # posts = Posts.query.filter_by(poster_id=current_user.id).all()
        for p in posts:
            p.thumbnail=base(p.thumbnail)
            p.lik=len(p.likes)
            p.commen=len(p.comments)
            # u=p.poster.username
            p.liked=bool(Like.query.filter(and_(Like.author==current_user.id,Like.post_id==p.id)).first())
            p.poster.profile_pic=base(p.poster.profile_pic,True)
        return posts

        
class SearchMyposts(Resource):
    @marshal_with(post_fields)
    @jwt_required()
    def get(self): 
        id=request.args.get('id') 
        query=request.args.get('query')
        current_user=m()  
        posts = Posts.query.filter_by(poster_id=id).filter(Posts.title.like('%' + query + '%')).all()
        # posts = posts.filter_by(posts.title.like('%' + query + '%'))
        # posts = Posts.query.filter_by(poster_id=current_user.id).all()
        for p in posts:
            p.thumbnail=base(p.thumbnail)
            p.lik=len(p.likes)
            p.commen=len(p.comments)
            # u=p.poster.username
            p.liked=bool(Like.query.filter(and_(Like.author==current_user.id,Like.post_id==p.id)).first())
            p.poster.profile_pic=base(p.poster.profile_pic,True)
        return posts

commenter_fields = {
    'profile_pic':    fields.String,
}

comment_fields = {
    'id' :  fields.Integer,
    'text':    fields.String, 
    'date_created' :    fields.String,
    'author' :    fields.Integer,
    'user':fields.Nested(commenter_fields)
}

postt_fields = {
    'id' :  fields.Integer,
    'lik' :  fields.Integer,
    'liked' :  fields.Boolean,
    'commen' :  fields.Integer,
    'title':    fields.String, 
    'content' :    fields.String,
    'timestamp' :    fields.String,
    'slug':    fields.String,
    'thumbnail': fields.String,
    'poster_id' :  fields.Integer,
    'poster':fields.Nested(resource_fields),
    'comments':fields.Nested(comment_fields)
}


class Post(Resource):
    @marshal_with(postt_fields)
    @jwt_required()
    def get(self,postid):  
        p = Posts.query.filter_by(id=postid).first()
        if p is None:
            raise NotFoundError(status_code=404)
        current_user=m()  
        p.thumbnail=base(p.thumbnail)
        p.lik=len(p.likes)
        p.commen=len(p.comments)
        p.commen=len(p.comments)
        p.liked=bool(Like.query.filter(and_(Like.author==current_user.id,Like.post_id==p.id)).first())
        p.poster.profile_pic=base(p.poster.profile_pic,True)
        
        return p
    @jwt_required()
    @marshal_with(post_fields)
    def put(self, postid):
        args = update_post_parser.parse_args()
        post = Posts.query.filter_by(id=postid).first()
        if post is None:
            raise NotFoundError(status_code=404)
        if args.get("title"):
            post.title = args.get("title")
        if args.get("content"):
            post.content = args.get("content")
        if args.get("slug"):
            post.slug = args.get("slug")
        db.session.commit()
        return post       
    @jwt_required()
    def delete(self, postid):
        post = Posts.query.filter_by(id=postid).first()
        if post is None:
            raise NotFoundError(status_code=404)
        db.session.delete(post)
        db.session.commit()
        return ''  

class Postofuser(Resource):
    @jwt_required()
    @marshal_with(post_fields)
    def get(self, username):
        userp = us(username)
        user = userp.posts.all()
        if user is None:
            raise NotFoundError(status_code=404)
        return user
    @marshal_with(post_fields)
    @jwt_required()
    def post(self, username):
        user = us(username)
        if user is None:
            raise NotFoundError(status_code=404)
        args = create_post_parser.parse_args()
        title = args["title"]
        content = args["content"]
        slug = args["slug"]


        post = Posts(title=title, content=content,poster_id=user.id, slug=slug)
        
        db.session.add(post)
        db.session.commit()
        return post, 201

comment_fields = {
    'id' :  fields.Integer,
    'text':    fields.String, 
    'date_created' :    fields.String,
    'user_name' :    fields.String,
    'user_profile_pic' :    fields.String,
    'author' :    fields.Integer,
    'post_id':    fields.Integer
}

class commentofpost(Resource):
    @jwt_required()
    @marshal_with(comment_fields)
    def get(self, postid):
        postp = Posts.query.filter_by(id=postid).first()
        if postp is None:
            raise NotFoundError(status_code=404)
        post=postp.comments
        for c in post:
            commenter=Users.query.filter_by(id=c.author).first()
            c.user_name=commenter.name
            c.user_profile_pic=base(commenter.profile_pic,True)
        return post

class likepost(Resource):
    @jwt_required()
    def get(self, postid):
        postp = Posts.query.filter_by(id=postid).first()
        if postp is None:
            raise NotFoundError(status_code=404)
        likes=postp.likes
    
        return {'likes':len(likes)}

class followersinfo(Resource):
    @jwt_required()
    def get(self, username):
        userp = us(username)
        follower = userp.followers.count()
        followed = userp.followed.count()
        # if userp is None:
        #     raise NotFoundError(status_code=404)
        return {'followers':follower,'followed':followed}

class followinginfo(Resource):
    @jwt_required()
    def get(self, username):
        userp = us(username)
        user = userp.followed.count()
        if userp is None:
            raise NotFoundError(status_code=404)
        return {'following':user}


