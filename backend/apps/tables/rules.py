from typing import List

from rules import constants


def define_rules() -> List:
    attributes_element = {
        "data_type": constants.DATA_TYPE_STRING,
        "data_type_rules": {
            "max_length": 40,
            "transform": constants.TRANSFORM_SLUG,
            "is_nullable": False,
        }
    }

    return [
        {
            "field_name": "attributes",
            "data_type": constants.DATA_TYPE_ARRAY,
            "data_type_rules": {
                "max_elements": None,
                "element": attributes_element,
            },
        },
        {
            "field_name": "created_at",
            "defaults": [{
                "data": constants.ENVIRONMENT_CURRENT_DATETIME_UTC,
                "action": constants.ACTION_TYPE_INSERT,
            }],
        },
        {
            "field_name": "modified_at",
            "defaults": [{
                "data": constants.ENVIRONMENT_CURRENT_DATETIME_UTC,
                "action": constants.ACTION_TYPE_UPDATE,
            }],
        },
    ]
