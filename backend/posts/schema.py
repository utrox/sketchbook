import graphene
from graphene import relay

from .models import Post
from .types import PostConnection, PostNode
from .mutations import CreatePost, UpdatePost, DeletePost


class Query(graphene.ObjectType):
    feed = relay.ConnectionField(PostConnection)
    post_by_id = graphene.Field(PostNode, id=graphene.ID(required=True))

    def resolve_feed(root, info, **kwargs):
        return Post.objects.all().order_by('-created_at')
    
    def resolve_post_by_id(root, info, id):
        return Post.objects.get(pk=id)


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    delete_post = DeletePost.Field()
