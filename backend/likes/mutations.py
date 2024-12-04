import graphene

from posts.models import Post
from posts.types import PostNode
from comments.models import Comment
from comments.types import CommentNode
from core.exceptions import (
    BadRequestException,
    NotFoundException,
    UnauthenticatedException
)

from .models import CommentLike, PostLike

#########################################################
# Likes for comments                                    #
#########################################################
class ToggleCommentLike(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)

    comment = graphene.Field(CommentNode)

    def mutate(self, info, comment_id=None):
        user = info.context.user

        if not user.is_authenticated:
            raise UnauthenticatedException("You must be logged in to like a comment.")

        try:
            comment = Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            raise NotFoundException("Comment does not exist.")

        try:
            like = CommentLike.objects.get(user_id=user.pk, comment_id=comment_id)
            like.delete()
        except CommentLike.DoesNotExist:
            like = CommentLike(user_id=user.pk, comment_id=comment_id)
            like.save()
        return ToggleCommentLike(comment=comment)


#########################################################
# Likes for posts                                       #
#########################################################
class TogglePostLike(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)

    post = graphene.Field(PostNode)

    def mutate(self, info, post_id=None):
        user = info.context.user

        if not user.is_authenticated:
            raise UnauthenticatedException("You must be logged in to like a post.")

        if not post_id:
            raise BadRequestException("Post ID is required.")

        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            raise NotFoundException("Post does not exist.")

        try:
            like = PostLike.objects.get(user_id=user.pk, post_id=post_id)
            like.delete()
        except PostLike.DoesNotExist:
            like = PostLike(user_id=user.pk, post_id=post_id)
            like.save()
        return TogglePostLike(post=post)
