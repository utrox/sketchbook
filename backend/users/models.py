import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from .validators import validate_image

AVATAR_UPLOAD_PATH = os.path.join("images", "avatars")
BACKGROUND_UPLOAD_PATH = os.path.join("images", "backgrounds")
DEFAULT_AVATAR = os.path.join(AVATAR_UPLOAD_PATH, "default.png")
DEFAULT_BACKGROUND = os.path.join(BACKGROUND_UPLOAD_PATH, "default.png")


class User(AbstractUser):
    avatar = models.ImageField(upload_to=AVATAR_UPLOAD_PATH, default=DEFAULT_AVATAR)
    background = models.ImageField(upload_to=BACKGROUND_UPLOAD_PATH, default=DEFAULT_BACKGROUND)
    created_at = models.DateTimeField(auto_now_add=True)

    def check_username_validity(self, username):
        if len(username) < 3 or len(username) > 20:
            raise ValueError("Username must be at least 3 and at most 20 characters long.")
        if self.username != username and User.objects.filter(username=username).exists():
            raise ValueError("Username already exists.")
        if not username.isalnum():
            raise ValueError("Username must be alphanumeric.")

    def override_avatar(self, avatar):
        validate_image(avatar)
        
        if self.avatar != DEFAULT_AVATAR:
            self.avatar.delete(save=False)
        self.avatar = avatar

    def override_background(self, background):
        validate_image(background)

        if self.background != DEFAULT_BACKGROUND:
            self.background.delete(save=False)
        self.background = background

    def save(self, *args, **kwargs):
        self.check_username_validity(self.username)
        self.full_clean()

        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username
