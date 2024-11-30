import graphene
from graphene import relay
from django.contrib.auth import get_user_model

from .models import Post
from .types import PostConnection, PostNode
from .mutations import CreatePost, UpdatePost, DeletePost

User = get_user_model()

class Query(graphene.ObjectType):
    feed = relay.ConnectionField(PostConnection)
    post_history = relay.ConnectionField(PostConnection, username=graphene.String(required=True))
    post_by_id = graphene.Field(PostNode, id=graphene.ID(required=True))

    def resolve_feed(root, info, **kwargs):
        return Post.objects.all().order_by('-created_at')
    
    def resolve_post_by_id(root, info, id):
        return Post.objects.get(pk=id)
    
    def resolve_post_history(root, info, username, **kwargs):
        if not User.objects.filter(username=username).exists():
            raise Exception('User not found.')

        return Post.objects.filter(user__username=username).order_by('-created_at')


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    delete_post = DeletePost.Field()
