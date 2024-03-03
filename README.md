# Dwata

Dwata is a desktop app to chat with any AI model and get insights from your data. Chats are threaded, like in Discord and each thread can connect to a different AI model. Dwata can connect databases, APIs (like Stripe) or CSV files and send structure/data as prompt **when you** need.

## Introduction

Hello! I am Sumit and Dwata is a product that I have tried building a few times. I was focused on a GUI based product earlier but I feel AI models can be a better interface.

Dwata will be able to read data from:

- Databases like PostgreSQL, MySQL or MongoDB
- SaaS products like Stripe or Shopify (API or CSV)
- Your own custom software (CSV or API)
- CSV files/folders
- Email (IMAP)

## What does it solve?

AI models have shown really good results in understanding human language and bridging the gap to interacting with computers. Dwata starts with chats and then allows you to (explicitly) add data or structure (of the data) to the chats. The response can have SQL or Python code which can then be used to get the insights needed.

Dwata can check the AI generated SQL to see if the tables or columns referred are correct, else ask the AI again for corrections. When the SQL looks good, you can query your database from Dwata itself and see the results.

![Results from SQL query](docs/assets/Home_view_revamp_2024.png?raw=true "Results from SQL query")

Similarly Python code (usually with Pandas) will also be executable from within Dwata. This is way out in the future as I first want to get the SQL part working minimally.

**dwata is in early development stage.**
