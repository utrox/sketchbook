import graphene
from graphene_django.types import DjangoObjectType

from .models import PostLike, CommentLike
from users.schema import UserType


class CommentLikeType(DjangoObjectType):
    class Meta:
        model = CommentLike

    user = graphene.Field(UserType)


class PostLikeType(DjangoObjectType):
    class Meta:
        model = PostLike

    user = graphene.Field(UserType)
