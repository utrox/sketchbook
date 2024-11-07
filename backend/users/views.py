from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_POST
from django.db import IntegrityError


User = get_user_model()

""" TODO: use the exception handler to give the error responses. """
@require_POST
def login_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    if not username or not password:
        return HttpResponse("Username and password are required", status=400)
    
    user = authenticate(username=username, password=password)
    if user is not None:
        auth_login(request, user)
        return HttpResponseRedirect('/')
    
    return HttpResponse("Invalid credentials", status=401)


@require_POST
def logout_view(request):
    auth_logout(request)
    return HttpResponseRedirect('/')


@require_POST
def register_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')

    if not username or not password:
        return HttpResponse("Username and password are required", status=400)
    
    try:
        User.objects.create_user(username=username, password=password)
    except IntegrityError:
        return HttpResponse("Username already exists", status=409)
    
    return HttpResponseRedirect('/')
