from django.contrib.auth.password_validation import (
    MinimumLengthValidator,
    NumericPasswordValidator,
    CommonPasswordValidator,
)
from django.core.exceptions import ValidationError
from django.core.files.images import get_image_dimensions
from django.core.files.uploadedfile import InMemoryUploadedFile


def validate_password(password: str):
    """Run validators on a password and return a list of errors."""
    validators = [
        MinimumLengthValidator,
        NumericPasswordValidator,
        CommonPasswordValidator,
    ]
    errors = []

    for validator in validators:
        try:
            validator().validate(password)
        except ValidationError as e:
            errors.append(str(e.messages[0]))
    
    # There's no built-in validator for password maximum length, so we'll add it here.
    if len(password) > 32:
        errors.append(ValidationError("Password must be at most 32 characters long."))

    return errors


def validate_image(image: InMemoryUploadedFile):
    """ Raises exceptions if the image is too big, too small, or not an image. """
    width, height = get_image_dimensions(image)
    accepted_types = ["image/jpeg", "image/png", "image/webp"]

    if image.content_type not in accepted_types:
        raise ValueError("File type is not supported. Supported file types are: jpg, jpeg, png, webp.")
    if image.size > 5 * 1024 * 1024:
        raise ValueError("Image size must be less than 5MB.")
    if width < 100 or height < 100:
        raise ValueError("Image dimensions must be at least 100x100 pixels.")
    if width > 2000 or height > 2000:
        raise ValueError("Image dimensions must be at most 2000x2000 pixels.")
