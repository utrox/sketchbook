from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from django.utils.module_loading import import_string

User = get_user_model()

# TODO: remove this middleware used for development
class AuthenticationDevelopmentMiddleware(MiddlewareMixin):
    def process_request(self, request):
        backend = import_string("django.contrib.auth.backends.ModelBackend")()
        request.user = backend.get_user(User.objects.all().first().id)
