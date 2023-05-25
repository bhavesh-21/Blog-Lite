import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from jinja2 import Template

from jinja2 import Template 
# from weasyprint import HTML
import uuid

def format_report (template_file, data={}): 
    with open(template_file) as file_: 
        template= Template (file_.read())
        return template.render(data=data)

def create_pdf_report(data):
    message = format_report("report.html", data=data) 
    html = HTML(string=message) 
    file_name = str(uuid.uuid())+".pdf" 
    print(file_name)
    html.write_pdf(target=file_name)
    return(file_name)


SMPTP_SERVER_HOST = "localhost"
SMPTP_SERVER_PORT = 1025
SENDER_ADDRESS = "support@bloglite.com"
SENDER_PASSWORD =""

def send_email(to_address, subject, message, content="text", attachment_file=None):
    msg = MIMEMultipart()
    msg["From"] = SENDER_ADDRESS 
    msg["To"] = to_address
    msg["Subject"] = subject

    if content == "html":
        msg.attach (MIMEText (message, "html"))
    else: msg.attach (MIMEText (message, "plain"))

    if attachment_file:

        with open(attachment_file, "rb") as attachment: # Add file as application/octet-stream

            part = MIMEBase("application", "octet-stream") 
            part.set_payload (attachment.read())

        encoders.encode_base64(part)
        part.add_header ( "Content-Disposition", f"attachment; filename= {attachment_file}",

            ) 

    s = smtplib.SMTP (host=SMPTP_SERVER_HOST, port=SMPTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD) 
    s.send_message (msg)
    s.quit()

    return True

def format_message (template_file, data={}): 
    with open(template_file) as file_: 
        template= Template(file_.read()) 
        return template.render(data=data)

def send_welcome_message(data):
    message = format_message("report.html", data=data) 
    send_email(
        data["email"],
        subject="Monthly BlogLite engagement Report",
        message=message,
        content="html",
        # attachment_file=att,
    )
    
     

