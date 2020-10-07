import os
import sys
import asyncio
from random import random
from sqlalchemy import MetaData
from faker import Faker
from faker.providers import address, company, phone_number, lorem, internet

sys.path.append(os.getcwd())
from utils.settings import get_source_settings
from database.schema import get_schema
from database.connect import connect_database

fake = Faker()
fake.add_provider(address)
fake.add_provider(company)
fake.add_provider(phone_number)
fake.add_provider(lorem)
fake.add_provider(internet)


def handle_column(name, attributes):
    if attributes["type"] in ["VARCHAR", "TEXT"]:
        if "length" in attributes and attributes["length"] is not None:
            if attributes["length"] < 20:
                if name == "country" and attributes["length"] == 2:
                    return fake.country_code
        if "length" not in attributes or attributes["length"] is None or attributes["length"] >= 20:
            if "name" in name:
                if "company" in name:
                    return lambda: "{} {}".format(fake.company(), fake.company_suffix())
                elif "first" in name:
                    return lambda: fake.name().split(" ")[0]
                else:
                    return lambda: fake.name().split(" ")[1]
            elif "street" in name:
                return fake.street_address
            elif "city" in name:
                return fake.city
            elif name == "country":
                return fake.country
            elif name in ["postcode", "postal_code"]:
                return fake.postcode
            elif "phone" in name:
                return fake.phone_number
            elif "description" in name:
                return fake.paragraph
            elif "title" in name:
                return fake.sentence
            elif "slug" in name:
                return fake.slug
            elif "email" in name:
                return fake.ascii_email
            elif "url" in name or "uri" in name:
                return fake.uri
    elif attributes["type"] == "BOOLEAN":
        return True if random() < 0.5 else False

    return None


def handle_table(name, properties, columns):
    row_faker = {}

    for col in columns:
        col_name = col["name"]
        if col["is_primary_key"]:
            # Nothing to do with PK
            continue

        col_fake = handle_column(col_name, col)
        if col_fake is not None:
            row_faker[col_name] = col_fake

    return row_faker


def fake_value():
    pass


async def generate_fake():
    source_label = "myteeshop"
    source_settings = await get_source_settings(source_label=source_label)
    engine, conn = await connect_database(db_url=source_settings["db_url"])
    meta = MetaData(bind=engine)
    meta.reflect()
    schema = await get_schema(
        source_settings=source_settings,
        meta=meta
    )
    for row in schema["rows"]:
        if len([col for col in row[2] if "is_meta" not in col["ui_hints"]]) < 3:
            continue
        if len([col for col in row[2] if not col["is_nullable"] and col["foreign_keys"]]) > 0:
            continue
        print(row[0])
        col_names = [col["name"] for col in row[2]]
        row_faker = handle_table(*row)
        faked_col_names = row_faker.keys()
        if len(row_faker) < len(row[2]) - 1:
            print("*** missing ***")
            print(col_names - faked_col_names)
        else:
            for name, fk in row_faker.items():
                print("{}: {}".format(name, fk()))


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    tasks = [
        loop.create_task(generate_fake())
    ]
    loop.run_until_complete(asyncio.wait(tasks))
    loop.close()
