class CustomException(Exception):
    pass

class BadRequestException(CustomException):
    def __init__(self, message):
        self.message = message
        self.status_code = 400
        super().__init__(self.message)

class UnauthorizedException(CustomException):
    def __init__(self, message):
        self.message = message
        self.status_code = 401
        super().__init__(self.message)

class ConflictException(CustomException):
    def __init__(self, message):
        self.message = message
        self.status_code = 409
        super().__init__(self.message)
