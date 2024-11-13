import graphene
from .models import Comment
from .types import CommentNode


class CommentInput(graphene.InputObjectType):
    post_id = graphene.ID(required=True)
    content = graphene.String(required=True)


class CreateComment(graphene.Mutation):
    class Arguments:
        input = CommentInput(required=True)

    comment = graphene.Field(CommentNode)

    def mutate(self, info, input=None):
        if not info.context.user.is_authenticated:
            raise Exception("You must be logged in to create a comment.")
        
        comment = Comment(content=input.content, post_id=input.post_id, user=info.context.user)
        comment.full_clean()
        comment.save()
        return CreateComment(comment=comment)


class UpdateComment(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = CommentInput(required=True)

    comment = graphene.Field(CommentNode)

    def mutate(self, info, id, input):
        try:
            comment = Comment.objects.get(pk=id)

            if not comment.can_edit(info.context.user):
                raise Exception("You are not authorized to edit this comment.")

            comment.content = input.content
            comment.save()

            return UpdateComment(comment=comment)
        except Comment.DoesNotExist:
            raise Exception(f"Comment not found by id {id}.")


class DeleteComment(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            comment = Comment.objects.get(pk=id)

            if not comment.can_edit(info.context.user):
                raise Exception("You are not authorized to delete this comment.")

            comment.delete()
            return DeleteComment(ok=True)
        except Comment.DoesNotExist:
            raise Exception(f"Comment not found by id {id}.")

