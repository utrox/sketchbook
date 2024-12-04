import graphene
from graphene import relay
from django.contrib.auth import get_user_model

from core.exceptions import BadRequestException

from .models import Post
from .types import PostConnection, PostNode
from .mutations import CreatePost, UpdatePost, DeletePost

User = get_user_model()

class Query(graphene.ObjectType):
    feed = relay.ConnectionField(PostConnection)
    post_history = relay.ConnectionField(PostConnection, username=graphene.String(required=True))
    post_by_id = graphene.Field(PostNode, post_id=graphene.ID(required=True))

    def resolve_feed(self, _, **_kwargs):
        return Post.objects.all().order_by('-created_at')

    def resolve_post_by_id(self, _, post_id):
        return Post.objects.get(pk=post_id)

    def resolve_post_history(self, _, username, **_kwargs):
        if not User.objects.filter(username=username).exists():
            raise BadRequestException('User not found.')

        return Post.objects.filter(user__username=username).order_by('-created_at')


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    delete_post = DeletePost.Field()
