import graphene
from graphene import relay

from .models import Comment
from .types import CommentConnection
from .mutations import CreateComment, UpdateComment, DeleteComment


class Query(graphene.ObjectType):
    all_comments_for_post = relay.ConnectionField(CommentConnection, post_id=graphene.ID(required=True))

    def resolve_all_comments_for_post(root, info, **kwargs):
        return Comment.objects.filter(post_id=kwargs['post_id']).order_by('-created_at')


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()
    delete_comment = DeleteComment.Field()
