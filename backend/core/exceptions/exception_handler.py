import logging
from django.http import JsonResponse
from .exceptions import CustomException

# TODO: add logging to exception handler
logger = logging.getLogger(__name__)


class CustomExceptionHandlerMiddleware:
    """
    Custom exception handler middleware, so that all exceptions are handled
    uniformly and similarly to graphQL errors.
    Also, added logging for the exceptions.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def _process_custom_exception(self, exception):
        if isinstance(exception.message, str):
            exception.message = [exception.message]
        
        return {
            "errors": [
                {
                    "message": error
                } for error in exception.message
            ],
        }
    
    def _process_default_exception(self, exception):
        return {
            "errors": [
                {
                    "message": str(exception)
                }
            ],
        }
        
    def process_exception(self, request, exception):
        # Match the response format to the default graphQL error,
        # so that it's easier to handle on the frontend.

        if isinstance(exception, CustomException):
            response_data = self._process_custom_exception(exception)
        else:
            response_data = self._process_default_exception(exception)
        
        status_code = getattr(exception, 'status_code', 500)
        
        return JsonResponse(response_data, status=status_code)
