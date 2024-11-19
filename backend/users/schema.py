import graphene
from graphene_django import DjangoObjectType

from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "avatar", "last_login", "date_joined")


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    user_profile = graphene.Field(UserType, id=graphene.ID(required=True))

    # TOOD: on the development server this will return the default
    # user, so that I dont have to log in every time I restart the server
    def resolve_me(root, info):
        return User.objects.get(username='q')
        #TODO: uncomment all after this:
        user = info.context.user
        
        if user.is_authenticated:
            return user
        
        return None
    
    def resolve_user_profile(root, info, id):
        return User.objects.get(id=id)
