import graphene

from posts.models import Post
from core.exceptions import (
    NotFoundException,
    UnauthorizedException,
    UnauthenticatedException
)

from .models import Comment
from .types import CommentNode



class CreateComment(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
        content = graphene.String(required=True)

    comment = graphene.Field(CommentNode)

    def mutate(self, info, post_id, content):
        if not info.context.user.is_authenticated:
            raise UnauthenticatedException("You must be logged in to create a comment.")

        if not Post.objects.filter(pk=post_id).exists():
            raise NotFoundException("Post does not exist.")

        comment = Comment(content=content, post_id=post_id, user=info.context.user)
        comment.full_clean()
        comment.save()
        return CreateComment(comment=comment)


class UpdateComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        content = graphene.String(required=True)

    comment = graphene.Field(CommentNode)

    def mutate(self, info, id, content):
        try:
            comment = Comment.objects.get(pk=id)

            if not comment.can_edit(info.context.user):
                raise UnauthorizedException("You are not authorized to edit this comment.")

            comment.content = content
            comment.save()

            return UpdateComment(comment=comment)
        except Comment.DoesNotExist:
            raise NotFoundException("Comment does not exist.")


class DeleteComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            comment = Comment.objects.get(pk=id)

            if not comment.can_edit(info.context.user):
                raise UnauthorizedException("You are not authorized to delete this comment.")

            comment.delete()
            return DeleteComment(ok=True)
        except Comment.DoesNotExist:
            raise NotFoundException("Comment does not exist.")
