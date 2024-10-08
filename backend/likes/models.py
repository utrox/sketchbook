from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'post')


class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey('comments.Comment', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'post')
