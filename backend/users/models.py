from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    avatar = models.ImageField(upload_to='images/avatars')

    def save(self, *args, **kwargs):
        if not self.avatar:
            self.avatar = 'images/avatars/default.png'
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username
