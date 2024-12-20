import graphene

from .models import User
from .types import UserType
from .mutations import EditUser


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    user_profile = graphene.Field(UserType, username=graphene.String(required=True))

    def resolve_me(self, info):
        user = info.context.user

        if user.is_authenticated:
            return user

        return None

    def resolve_user_profile(self, _, username):
        return User.objects.get(username=username)


class Mutation(graphene.ObjectType):
    edit_user_profile = EditUser.Field()
