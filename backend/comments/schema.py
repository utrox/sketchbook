import graphene
from graphene_django import DjangoObjectType

from .models import Comment
from users.schema import UserType


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = ("id", "post_id", "content", "created_at", "updated_at")

    user = graphene.Field(UserType)
    like_count = graphene.Int()

    def resolve_like_count(self, root, info, **kwargs):
        return Comment.objects.get(pk=self.id).likes.count()


class Query(graphene.ObjectType):
    all_comments_for_post = graphene.List(CommentType, post_id=graphene.ID(required=True))

    def resolve_all_comments_for_post(root, info, post_id):
        return Comment.objects.filter(post_id=post_id)
