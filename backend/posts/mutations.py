import graphene
from .models import Post
from .types import PostNode


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
            raise Exception("You must be logged in to create a post.")
        
        post = Post(content=post_data.content, image=post_data.image, user=user)
        post.full_clean()
        post.save()
        return CreatePost(post=post)


class UpdatePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = PostInput(required=True)

    post = graphene.Field(PostNode)

    def _can_edit(self, info, post):
        if not info.context.user.is_authenticated or post.user != info.context.user:
            return False


    def mutate(self, info, id, input):
        try:
            post = Post.objects.get(pk=id)

            if not post.can_edit(info.context.user):
                raise Exception("You are not authorized to edit this post.")
            
            post.content = input.content
            post.image = input.image
            
            post.save()
            return UpdatePost(post=post)
        except Post.DoesNotExist:
            raise Exception("Post not found")


class DeletePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            post = Post.objects.get(pk=id)

            if not post.can_edit(info.context.user):
                raise Exception("You are not authorized to delete this post.")
            
            post.delete()
            return DeletePost(ok=True)
        except Post.DoesNotExist:
            raise Exception("Post not found.")
