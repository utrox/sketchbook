from graphene_django import DjangoObjectType
from .models import User


# pylint: disable=R0903
class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            "id",
            "username", 
            "avatar", 
            "background", 
            "last_login", 
            "created_at"
        )
