from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    photo = models.ImageField(upload_to='User/Photo', null=True, blank=True)
    
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['first_name','username','last_name']