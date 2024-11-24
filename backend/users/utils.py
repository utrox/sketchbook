from django.contrib.auth.password_validation import (
    MinimumLengthValidator,
    NumericPasswordValidator,
    CommonPasswordValidator
)
from django.core.exceptions import ValidationError

def validate_password(password):
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

    return errors
