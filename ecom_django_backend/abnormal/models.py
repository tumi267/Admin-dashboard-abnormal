# abnormal/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    department = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    # Username validation similar to Instagram's pattern
    username_validator = RegexValidator(
        regex=r'^[a-zA-Z0-9_.]+$',
        message='Username can only contain letters, numbers, periods and underscores.'
    )
    username = models.CharField(
        max_length=30,
        unique=True,
        validators=[username_validator],
        error_messages={
            'unique': 'Username is already taken.',
        }
    )
    
    # Make first_name and last_name required
    first_name = models.CharField(max_length=150, blank=False)
    last_name = models.CharField(max_length=150, blank=False)

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'department']