from django.db import models
from django.contrib.auth import get_user_model
from utils.models import TimestampedModel


User = get_user_model()


class Post(TimestampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    image = models.ImageField(upload_to='images/posts', blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} - {self.content[:20]}'
