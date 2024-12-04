import graphene
from graphene_file_upload.scalars import Upload

from .types import UserType

class EditUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=False)
        password = graphene.String(required=False)
        avatar =  Upload(required=False)
        background = Upload(required=False)

    user = graphene.Field(UserType)
    ok = graphene.Boolean()

    def mutate(self, info, username=None, password=None, avatar=None, background=None):
        user = info.context.user
        if username:
            user.username = username
        if password:
            user.set_password(password)
        if avatar:
            user.override_avatar(avatar)
        if background:
            user.override_background(background)

        user.save()
        return EditUser(user=user, ok=True)
