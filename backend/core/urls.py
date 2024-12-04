"""
URL configuration for sketchbook project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include, re_path
from graphene_file_upload.django import FileUploadGraphQLView

from .schema import schema
from .views import serve_react, serve_media_images

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql', FileUploadGraphQLView.as_view(graphiql=True, schema=schema)),
    path('auth/', include('users.urls')),
    # Serve media files
    re_path(
        r"^images/(?P<path>.*)$",
        serve_media_images,
        {"document_root": settings.MEDIA_IMAGES_ROOT}
    ),
    # Serve static and react files
    re_path(
        r"^(?P<path>.*)$",
        serve_react,
        {"document_root": settings.REACT_APP_BUILD_PATH}
    ),
]

# Serve media files securely in dev
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
