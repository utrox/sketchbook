import graphene
from graphene import relay

from .models import CommentLike, PostLike
from .types import CommentLikeConnection, PostLikeConnection
from .mutations import TogglePostLike, ToggleCommentLike


class Query(graphene.ObjectType):
    all_likers_for_comment = relay.ConnectionField(CommentLikeConnection, comment_id=graphene.ID(required=True))
    all_likers_for_post = relay.ConnectionField(PostLikeConnection, post_id=graphene.ID(required=True))

    def resolve_all_likers_for_comment(root, info, comment_id, **kwargs):
        return CommentLike.objects.filter(comment_id=comment_id)
    
    def resolve_all_likers_for_post(root, info, post_id, **kwargs):
        return PostLike.objects.filter(post_id=post_id)


class Mutation(graphene.ObjectType):
    toggle_comment_like = ToggleCommentLike.Field()
    toggle_post_like = TogglePostLike.Field()
