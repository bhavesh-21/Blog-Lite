import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
    DEBUG = False
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    CELERY_BROKER_URL='redis://localhost:6379/1',
    CELERY_RESULT_BACKEND='redis://localhost:6379/2'
    JWT_SECRET_KEY = "super-secret" 
    # CACHE_TYPE="RedisCache"
    # CACHE_REDIS_HOST="localhost"
    # CACHE_REDIS_PORT=6379

class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR = os.path.join(basedir, "../db_directory")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "blog.db")
    DEBUG = True
    SECRET_KEY= "Secret Key"
    PIC_FOLDER= 'static/images/user_pic'
    POST_FOLDER = 'static/images/post_pic'
    POSTS_PER_PAGE = 9
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'

