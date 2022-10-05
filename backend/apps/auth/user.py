class AuthenticatedUser:
    __user_id__ = None

    def __init__(self, id):
        self.__user_id__ = id

    @property
    def is_authenticated(self) -> bool:
        return True
