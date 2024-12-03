""" This command creates a default superuser if not exists. """
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()

class Command(BaseCommand):
    """ 
    With this command we can create a default superuser
    based on the environment variables.
    """

    def handle(self, *args, **options):
        super(Command, self).handle(*args, **options)
        self.stdout.write("Creating default superuser if not exists...")
        username = os.environ.get("SKTCH_ADMIN_USERNAME"), 
        password = os.environ.get("SKTCH_ADMIN_PASSWORD")
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username, password)
            self.stdout.write("Default superuser created.")
        else:
            user = User.objects.get(username=username)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            self.stdout.write("Default superuser already exists.")