# abnormal/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator,  MinValueValidator, FileExtensionValidator
from django.core.exceptions import ValidationError

class User(AbstractUser):
    department = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    new_email = models.EmailField(blank=True, null=True)
    
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


def validate_image_size(value):
    # 2MB = 2097152 bytes
    if value.size > 2097152:
        raise ValidationError('Image size cannot exceed 2MB.')

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to='products/',
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
            validate_image_size
        ]
    )
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name