import os
from flask import Flask,send_file
from flask_restful import Resource, Api
from application import config
from application.config import LocalDevelopmentConfig
from application.data.database import db

from application.data.models import *
from flask_jwt_extended import JWTManager

from application.jobs.celery_worker import make_celery
from flask_cors import CORS
from flask_caching import Cache
app = None
api = None
cache=None

import time

def create_app():
    app = Flask(__name__, template_folder="templates")
    if os.getenv('ENV', "development") == "production":
      raise Exception("No Production Configuration.")
    else:
      print("Setting Local Development Configuration")
      app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api = Api(app)
    app.app_context().push()
    return app, api

app, api = create_app()
CORS(app)
app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(app)
app.config["JWT_SECRET_KEY"] = "super-secret" 
jwt = JWTManager(app)
cache=Cache(app)

from application.jobs.tasks import *
from application.controller.controllers import *


from application.controller.api import *
api.add_resource(User,"/api/user/<string:username>", endpoint='user-api')
api.add_resource(followersinfo,"/api/user/<string:username>/followers", endpoint='followers-api')
api.add_resource(followinginfo,"/api/user/<string:username>/following", endpoint='following-api')
api.add_resource(Postofuser,'/api/user/<string:username>/post', endpoint='user-posts-api')
api.add_resource(commentofpost,'/api/comments/post/<int:postid>', endpoint='comment-posts-api')
api.add_resource(likepost,'/api/likes/post/<int:postid>', endpoint='like-posts-api')

api.add_resource(Post,'/api/post/<int:postid>', endpoint='post-api')
api.add_resource(User_all, "/api/user")
api.add_resource(Search_User, "/api/search/user", endpoint='search-user-api')
api.add_resource(Feed,'/api/feed', endpoint='feed-api')
api.add_resource(SearchFeed,'/api/search/feed', endpoint='search-feed-api')
api.add_resource(Myposts,'/api/my-posts', endpoint='Myposts-api')
api.add_resource(SearchMyposts,'/api/search/my-posts', endpoint='Search-Myposts-api')
api.add_resource(Myfollowers,'/api/followers/<string:username>', endpoint='followers-list-api')
api.add_resource(Myfollowing,'/api/following/<string:username>', endpoint='following-list-api')

if __name__ == '__main__':
  app.run(host='0.0.0.0',port=8000)
