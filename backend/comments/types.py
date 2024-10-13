import graphene
from graphene_django.types import DjangoObjectType

from .models import Comment
from users.schema import UserType


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = ("id", "content", "created_at", "updated_at")

    user = graphene.Field(UserType)
    like_count = graphene.Int()

    def resolve_like_count(self, info, **kwargs):
        return Comment.objects.get(pk=self.id).likes.count()
