from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('MANAGER', 'Manager'),
        ('SUPPORT', 'Support'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='SUPPORT')
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def clean(self):
        if self.role == 'ADMIN' and not self.is_superuser:
            raise ValidationError("Admin role requires superuser status.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)