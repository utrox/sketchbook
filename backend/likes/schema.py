import graphene
from graphene_django import DjangoObjectType

from .models import CommentLike, PostLike
from users.schema import UserType


class CommentLikeType(DjangoObjectType):
    class Meta:
        model = CommentLike

    user = graphene.Field(UserType)


class PostLikeType(DjangoObjectType):
    class Meta:
        model = PostLike

    user = graphene.Field(UserType)


class Query(graphene.ObjectType):
    all_likers_for_comment = graphene.List(CommentLikeType, comment_id=graphene.ID(required=True))
    all_likers_for_post = graphene.List(PostLikeType, post_id=graphene.ID(required=True))

    def resolve_all_likers_for_comment(root, info, comment_id):
        return CommentLike.objects.filter(comment_id=comment_id)
    
    def resolve_all_likers_for_post(root, info, post_id):
        return PostLike.objects.filter(post_id=post_id)
