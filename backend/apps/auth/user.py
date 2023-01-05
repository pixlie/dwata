from starlette.authentication import BaseUser


class AuthenticatedUser(BaseUser):
    __identity__ = None

    def __init__(self, identity):
        self.__identity__ = identity

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def display_name(self) -> str:
        return "User {}".format(self.__identity__)

    @property
    def identity(self) -> str:
        return self.__identity__
