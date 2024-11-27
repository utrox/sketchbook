from django.db import models
from django.contrib.auth import get_user_model
from utils.models import TimestampedModel
from django.core.validators import MaxLengthValidator, MinLengthValidator


User = get_user_model()


class Comment(TimestampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(validators=[MaxLengthValidator(280), MinLengthValidator(3)])

    def can_edit(self, user) -> bool:
        return user.is_authenticated and self.user == user
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} - {self.content[:20]}'
