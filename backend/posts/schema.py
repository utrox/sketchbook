import graphene
from graphene import relay

from .models import Post
from .types import PostConnection
from .mutations import CreatePost, UpdatePost, DeletePost


class Query(graphene.ObjectType):
    feed = relay.ConnectionField(PostConnection)

    def resolve_feed(root, info, **kwargs):
        return Post.objects.all().order_by('-created_at')


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    delete_post = DeletePost.Field()
