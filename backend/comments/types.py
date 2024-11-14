import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType

from .models import Comment
from users.schema import UserType


class CommentNode(DjangoObjectType):
    class Meta:
        model = Comment
        interfaces = [relay.Node]
        fields = ("id", "content", "created_at", "updated_at")
    
    user = graphene.Field(UserType)
    like_count = graphene.Int()
    liked_by_user = graphene.Boolean()

    def resolve_like_count(self, info, **kwargs):
        return Comment.objects.get(pk=self.id).likes.count()

    def resolve_liked_by_user(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            return False
        return Comment.objects.get(pk=self.id).likes.filter(user_id=user.id).exists()


class CommentConnection(relay.Connection):
    class Meta:
        node = CommentNode
