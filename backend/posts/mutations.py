import logging
import graphene

from core.exceptions import (
    NotFoundException,
    UnauthenticatedException,
    UnauthorizedException
)

from .models import Post
from .types import PostNode


logger = logging.getLogger(__name__)


class PostInput(graphene.InputObjectType):
    content = graphene.String(required=True)
    image = graphene.String()


class CreatePost(graphene.Mutation):
    class Arguments:
        post_data = PostInput(required=True)

    post = graphene.Field(PostNode)

    def mutate(self, info, post_data=None):
        user = info.context.user

        if not user.is_authenticated:
            raise UnauthenticatedException("You must be logged in to create a post.")

        post = Post(content=post_data.content, image=post_data.image, user=user)
        post.full_clean()
        post.save()
        logger.info(f"User {user.pk} created post {post.pk}.")
        return CreatePost(post=post)


class UpdatePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        post_data = PostInput(required=True)

    post = graphene.Field(PostNode)

    def _can_edit(self, info, post):
        return info.context.user.is_authenticated and post.user == info.context.user

    def mutate(self, info, id, post_data):
        try:
            post = Post.objects.get(pk=id)

            if not post.can_edit(info.context.user):
                raise UnauthorizedException("You are not authorized to edit this post.")

            post.content = post_data.content
            post.image = post_data.image

            post.save()
            logger.info(f"User {info.context.user.pk} updated post {post.pk}.")
            return UpdatePost(post=post)
        except Post.DoesNotExist:
            raise NotFoundException("Post does not exist.")


class DeletePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            post = Post.objects.get(pk=id)

            if not post.can_edit(info.context.user):
                raise UnauthorizedException("You are not authorized to delete this post.")

            post.delete()
            logger.info(f"User {info.context.user.pk} deleted post {id}.")
            return DeletePost(ok=True)
        except Post.DoesNotExist:
            raise NotFoundException("Post does not exist.")
