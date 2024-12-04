import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType

from users.schema import UserType
from .models import PostLike, CommentLike


class CommentLikeNode(DjangoObjectType):
    class Meta:
        model = CommentLike
        interfaces = [relay.Node]
        fields = ["id"]

    user = graphene.Field(UserType)


class PostLikeNode(DjangoObjectType):
    class Meta:
        model = PostLike
        interfaces = [relay.Node]
        fields = ["id"]

    user = graphene.Field(UserType)


class CommentLikeConnection(relay.Connection):
    class Meta:
        node = CommentLikeNode


class PostLikeConnection(relay.Connection):
    class Meta:
        node = PostLikeNode
