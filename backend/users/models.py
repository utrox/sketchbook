from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    avatar = models.ImageField(upload_to='images/avatars', default='images/avatars/default.png')
    background = models.ImageField(upload_to='images/backgrounds', default='images/backgrounds/default.png')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
