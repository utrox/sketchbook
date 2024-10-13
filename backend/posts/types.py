import graphene
from graphene import relay
from graphene_django import DjangoObjectType

from .models import Post
from users.schema import UserType


class PostNode(DjangoObjectType):
    class Meta:
        model = Post
        interfaces = [relay.Node]
        fields = ("id", "content", "image", "created_at", "updated_at")

    user = graphene.Field(UserType)
    like_count = graphene.Int()
    comment_count = graphene.Int()

    def resolve_like_count(self, info, **kwargs):
        return Post.objects.get(pk=self.id).likes.count()
    
    def resolve_comment_count(self, info, **kwargs):
        return Post.objects.get(pk=self.id).comments.count()


class PostConnection(relay.Connection):
    class Meta:
        node = PostNode
