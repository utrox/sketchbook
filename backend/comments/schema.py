import graphene

from .models import Comment
from .types import CommentType
from .mutations import CreateComment, UpdateComment, DeleteComment


class Query(graphene.ObjectType):
    all_comments_for_post = graphene.List(CommentType, post_id=graphene.ID(required=True))

    def resolve_all_comments_for_post(root, info, post_id):
        return Comment.objects.filter(post_id=post_id)


class Mutation(graphene.ObjectType):
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()
    delete_comment = DeleteComment.Field()
