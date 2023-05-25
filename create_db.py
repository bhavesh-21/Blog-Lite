from fileinput import filename
from app import app,db
import os

location='db_directory/blog.db'
if os.path.exists(location):
    os.remove(location)
with app.app_context():
    db.create_all()
print('Created New Database')