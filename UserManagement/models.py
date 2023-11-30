from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    is_user = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    email = models.EmailField(unique=True)
    photo = models.ImageField(upload_to='User/Photo', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['first_name','username','last_name']