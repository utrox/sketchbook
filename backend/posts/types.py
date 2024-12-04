import graphene
from graphene import relay
from graphene_django import DjangoObjectType

from users.schema import UserType
from .models import Post


class PostNode(DjangoObjectType):
    class Meta:
        model = Post
        interfaces = [relay.Node]
        fields = ("id", "content", "image", "created_at", "updated_at")

    user = graphene.Field(UserType)
    likers = graphene.List(UserType)
    like_count = graphene.Int()
    liked_by_user = graphene.Boolean()
    comment_count = graphene.Int()

    def resolve_like_count(self, _, **_kwargs):
        return Post.objects.get(pk=self.id).likes.count()

    def resolve_likers(self, _, **_kwargs):
        return [l.user for l in Post.objects.get(pk=self.id).likes.all()]

    def resolve_comment_count(self, _, **_kwargs):
        return Post.objects.get(pk=self.id).comments.count()

    def resolve_liked_by_user(self, info, **_kwargs):
        user = info.context.user
        if user.is_anonymous:
            return False
        return Post.objects.get(pk=self.id).likes.filter(user_id=user.id).exists()


class PostConnection(relay.Connection):
    class Meta:
        node = PostNode
