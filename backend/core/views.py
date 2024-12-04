import logging
import posixpath
from pathlib import Path

from django.utils._os import safe_join
from django.views.static import serve as static_serve

logger = logging.getLogger(__name__)

# TODO: logging
def serve_react(request, path, document_root=None):
    logging.info("Serving static file: %s", path)
    path = posixpath.normpath(path).lstrip("/")
    fullpath = Path(safe_join(document_root, path))
    if fullpath.is_file():
        return static_serve(request, fullpath, document_root)
    else:
        print("serving index.html")
        return static_serve(request, "index.html", document_root)


# TODO: make this view secure,
# only logged in users should be able to access media files
def serve_media_images(request, path, document_root=None):
    logging.info("Serving media file: %s", path)
    path = posixpath.normpath(path).lstrip("/")
    fullpath = Path(safe_join(document_root, path))
    return static_serve(request, fullpath, document_root)
