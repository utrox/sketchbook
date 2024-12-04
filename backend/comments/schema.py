import graphene
from graphene import relay

from posts.models import Post
from core.exceptions import NotFoundException

from .models import Comment
from .types import CommentConnection
from .mutations import CreateComment, UpdateComment, DeleteComment

class Query(graphene.ObjectType):
    all_comments_for_post = relay.ConnectionField(
        CommentConnection,
        post_id=graphene.ID(required=True)
    )

    def resolve_all_comments_for_post(self, _, **kwargs):
        if not Post.objects.filter(pk=kwargs['post_id']).exists():
            raise NotFoundException("Post does not exist.")

        return Comment.objects.filter(post_id=kwargs['post_id']).order_by('-created_at')


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()
    delete_comment = DeleteComment.Field()
