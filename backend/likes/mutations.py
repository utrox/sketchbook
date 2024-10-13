import graphene

from .models import CommentLike, PostLike
from .types import CommentLikeType, PostLikeType

from posts.models import Post
from comments.models import Comment


#########################################################
# Likes for comments                                    #
#########################################################
class ToggleCommentLike(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)

    comment = graphene.Field(CommentLikeType)
    like_status = graphene.Boolean()

    def mutate(self, info, comment_id=None):
        user = info.context.user

        if not user.is_authenticated:
            raise Exception("You must be logged in to like a comment.")   
        
        try:
            Comment.objects.get(pk=comment_id)
        except Comment.DoesNotExist:
            raise Exception("Comment not found.")

        try:
            like = CommentLike.objects.get(user_id=user.pk, comment_id=comment_id)
            like.delete()
            like_status = False
        except CommentLike.DoesNotExist:
            like = CommentLike(user_id=user.pk, comment_id=comment_id)
            like.save()
            like_status = True
        return ToggleCommentLike(like_status=like_status)


#########################################################
# Likes for posts                                       #
#########################################################
class TogglePostLike(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)

    post = graphene.Field(PostLikeType)
    like_status = graphene.Boolean()

    def mutate(self, info, post_id=None):
        user = info.context.user

        if not user.is_authenticated:
            raise Exception("You must be logged in to like a post.") 

        if not post_id:
            raise Exception("Post ID is required.")  
        
        try:
            Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            raise Exception("Post not found.")
        
        try:
            like = PostLike.objects.get(user_id=user.pk, post_id=post_id)
            like.delete()
            like_status = False
        except PostLike.DoesNotExist:
            like = PostLike(user_id=user.pk, post_id=post_id)
            like.save()
            like_status = True
        return TogglePostLike(like_status=like_status)
