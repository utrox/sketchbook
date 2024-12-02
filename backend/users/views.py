import json

from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login, logout

from core.exceptions import (
    BadRequestException, 
    UnauthorizedException,
    ConflictException
)
from .validators import validate_password


User = get_user_model()


@require_POST
def login_view(request):
    if not request.body:
        raise BadRequestException("Request body is empty.")
    
    json_data = json.loads(request.body)
    username = json_data.get('username', '')
    password = json_data.get('password', '')
    if not username or not password:
        raise BadRequestException("Username and password are required.")

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect('/')
    
    raise UnauthorizedException("Invalid username or password.")


@require_POST
def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')


@require_POST
def register_view(request):
    if not request.body:
        raise BadRequestException("Request body is empty.")
    
    json_data = json.loads(request.body)
    username = json_data.get('username', '')
    password = json_data.get('password', '')

    if not username or not password:
        raise BadRequestException("Username and password are required.")

    errors = validate_password(password)

    if errors:
        raise BadRequestException(errors)

    try:
        User.objects.create_user(username=username, password=password)
    except IntegrityError:
        raise ConflictException("Username already exists.")

    return HttpResponseRedirect('/')
