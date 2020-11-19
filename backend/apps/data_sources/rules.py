from typing import List

from rules import constants


def define_rules() -> List:
    configuration_structure = {
        "fields": [
            {
                "field_name": "db_url",
            },
            {
                "field_name": "db_type",
            },
            {
                "field_name": "host",
            },
            {
                "field_name": "port",
            },
            {
                "field_name": "username",
            },
            {
                "field_name": "password",
            },
        ],
        "field_groups": [
            {
                "fields": ["db_type", "host", "port", "username", "password"],
                "field_name": "database_connection_parameters",
            },
        ],
        "required": {
            "either": ["db_url", "database_connection_parameters"]
        }
    }

    return [
        {
            "field_name": "configuration",
            "data_type": constants.DATA_TYPE_ASSOCIATIVE_ARRAY,
            "data_type_rules": {
                "structure": configuration_structure,
            }
        },
    ]
