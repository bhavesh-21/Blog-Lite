from application.data.models import *
from app import cache
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import  verify_jwt_in_request


@cache.cached(timeout=50, key_prefix='m')
def m():
    verify_jwt_in_request()
    current_user=Users.query.filter_by(email=get_jwt_identity()).first()
    return current_user

@cache.memoize(50)
def us(username):
    uu=Users.query.filter_by(username=username).first()
    return uu

# def get_articles_by_username(username):
#     articles = Article.query.filter(Article.authors.any(username=username))
#      print(str(articles))
#     return articles

# def add_article_like(user_id, article_id):
#     new_like = ArticleLikes(user_id=user_id, article_id=article_id)
#     db.session.add(new_like)
#     db.session.commit()
#     return new_like
