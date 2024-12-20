import graphene
from graphene import relay

from posts.models import Post
from comments.models import Comment
from core.exceptions import NotFoundException

from .models import CommentLike, PostLike
from .types import CommentLikeConnection, PostLikeConnection
from .mutations import TogglePostLike, ToggleCommentLike


class Query(graphene.ObjectType):
    all_likers_for_comment = relay.ConnectionField(
        CommentLikeConnection,
        comment_id=graphene.ID(required=True)
    )
    all_likers_for_post = relay.ConnectionField(
        PostLikeConnection,
        post_id=graphene.ID(required=True)
    )

    def resolve_all_likers_for_comment(self, _, comment_id, **_kwargs):
        if not Comment.objects.filter(id=comment_id).exists():
            raise NotFoundException('Comment does not exist.')

        return CommentLike.objects.filter(comment_id=comment_id)

    def resolve_all_likers_for_post(self, _, post_id, **_kwargs):
        if not Post.objects.filter(id=post_id).exists():
            raise NotFoundException('Post does not exist.')

        return PostLike.objects.filter(post_id=post_id)


class Mutation(graphene.ObjectType):
    toggle_comment_like = ToggleCommentLike.Field()
    toggle_post_like = TogglePostLike.Field()
