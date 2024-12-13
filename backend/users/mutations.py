import logging
import graphene
from graphene_file_upload.scalars import Upload

from users.validators import validate_password
from core.exceptions import BadRequestException

from .types import UserType


logger = logging.getLogger(__name__)


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
            errors = validate_password(password)
            
            if errors:
                raise BadRequestException(errors)
            
            user.set_password(password)
        if avatar:
            user.override_avatar(avatar)
        if background:
            user.override_background(background)

        user.save()
        logger.info(f"User {user.pk} updated their profile.")
        return EditUser(user=user, ok=True)
