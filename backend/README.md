# dwata backend

This is the backend or API provider for dwata. This part of dwata is built with Python, using SQLAlchemy, Starlette and many other libraries.
We use Python `poetry` to manage the dependencies in our project's virtual environment.

## Settings

### AUTHENTICATION_METHODS
Possible values:
- email_list: list the specific emails or allowed domains, a code will be sent when logging in to verify ownership