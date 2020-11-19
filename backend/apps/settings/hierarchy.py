hierarchy = {
    "core": {
        "is_online": bool,
        "access": {
            "is_authentication_needed": bool,
            "is_authorization_needed": bool,
        }
    },
    "api_tokens": {
        "google": {
            "client_id": str,
        }
    }
}
