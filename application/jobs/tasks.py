

from codecs import utf_16_be_encode
from application.data.models import *
from datetime import datetime
from flask import send_file,request
from flask import current_app as app
import time
from celery.result import AsyncResult
from celery.schedules import crontab


from flask_jwt_extended import jwt_required
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_current_user
from flask_jwt_extended import  verify_jwt_in_request
from flask_jwt_extended import JWTManager

from app import celery

from celery.schedules import crontab
# print("crontab ", crontab)


# @celery.on_after_finalize.connect
# def setup_periodic_tasks(sender, **kwargs):
#     sender.add_periodic_task(10.0, print_current_time_job.s(), name='add every 10')


# @celery.task()
# def calculate_aggregate_likes(article_id):
#     # You can get all the likes for the `article_id`
#     # Calculate the aggregate and store in the DB
#     print("#####################################")
#     print("Received {}".format(article_id))
#     print("#####################################")
#     return True

# @celery.task()
# def just_say_hello(name):
#     print("INSIDE TASK")
#     print("Hello {}".format(name))


# @celery.task()
# def print_current_time_job():
#     print("START")
#     now = datetime.now()
#     print("now =", now)
#     dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
#     print("date and time =", dt_string) 
#     print("COMPLETE")

from application.controller.webhook import *
@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(
        crontab(hour=17,minute=14),
        # 5,
        daily.s(), name='Daily Remainder'
    )
    sender.add_periodic_task(
        crontab(hour=17,minute=14,day_of_week=1),
        # 5,
        sen.s(), name='Monthly Report'
    )
    sender.add_periodic_task(10.0, add_together.s(9, 6), name='add every 10')

@celery.task()
def send_report():

    new_users = []
    for user in Users.query.all():
        new_users.append({"name": user.name, "email": user.email})

    for user in new_users: 
        # att=create_pdf_report(data=user)
        send_welcome_message(data=user)
        

@celery.task()
def sen():

    new_users = []
    for user in Users.query.all():
        new_users.append({"name": user.name, "email": user.email})

    for user in new_users: 
        # att=create_pdf_report(data=user)
        send_welcome_message(data=user)

from json import dumps

from httplib2 import Http

@celery.task()
def daily():
    for ut in Users.query.all():
        if int((datetime.utcnow()-ut.last_login).total_seconds()) > 60:
            """Hangouts Chat incoming webhook quickstart."""
            url = 'https://chat.googleapis.com/v1/spaces/AAAAjDmzRaU/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=3b334CjUXg5G8gB8PDtp37MbrOuI2aL5DP49PG-3-Pg%3D'
            bot_message = {
                'text': '  Read new posts !'}
            message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
            http_obj = Http()
            response = http_obj.request(
                uri=url,
                method='POST',
                headers=message_headers,
                body=dumps(bot_message),
            )
            print(response)


@celery.task()
def add_together(a, b):
    time.sleep(5)
    return a + b



@celery.task
def generate_csv(me,email):
    curr=Users.query.filter_by(email=email).first()
    import csv
    print(me,"-------------------")
    fields = ['Post Title','slug','content', 'timestamp',  'thumbnail']
    if me=="false":
        posts = curr.followed_posts().all()

    else:
        posts = curr.posts.all()
        print("me posts==============")
    rows = []
    for post in posts:
      l=[post.title,post.slug,post.content,post.timestamp,post.thumbnail]
      rows.append(l)
    
    with open("static/data.csv", 'w') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(fields)
        csvwriter.writerows(rows)

    return "Job Started."

@app.route("/download-csv")
def download_file():
    return send_file("static/data.csv")

@app.route("/trigger-celery-job",methods=['GET'])
@jwt_required()
def trigger_celery_job():
    email=get_jwt_identity()
    me=request.args.get('me')
    a = generate_csv.delay(me,email)
    return {
        "Task_ID" : a.id,
        "Task_State" : a.state,
        "Task_Result" : a.result
    }

@app.route("/status/<id>")
def check_status(id):
    res = AsyncResult(id, app = celery)
    return {
        "Task_ID" : res.id,
        "Task_State" : res.state,
        "Task_Result" : res.result
    }
