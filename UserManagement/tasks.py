# tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string

@shared_task
def send_reset_email(user_email, reset_url):
    subject = 'Reset Your Password'
    html_message = render_to_string('user-admin/reset_password_email.html', {'reset_url': reset_url})
    send_mail(subject, '', 'habtamutesfaye.com@gmail.com', [user_email], html_message=html_message)
