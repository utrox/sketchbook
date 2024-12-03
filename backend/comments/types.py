import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType

from users.schema import UserType
from .models import Comment


class CommentNode(DjangoObjectType):
    class Meta:
        model = Comment
        interfaces = [relay.Node]
        fields = ("id", "content", "created_at", "updated_at")

    user = graphene.Field(UserType)
    like_count = graphene.Int()
    liked_by_user = graphene.Boolean()

    def resolve_like_count(self, _, **_kwargs):
        return Comment.objects.get(pk=self.id).likes.count()

    def resolve_liked_by_user(self, info, **_kwargs):
        user = info.context.user
        if user.is_anonymous:
            return False
        return Comment.objects.get(pk=self.id).likes.filter(user_id=user.id).exists()


class CommentConnection(relay.Connection):
    class Meta:
        node = CommentNode
