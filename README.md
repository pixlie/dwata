# Dwata

**No-code data exploration app which uses AI to get insights from business data. Use ChatGPT or self-hosted LLMs to query in plain English.**

## Revamped product coming soon!

Hello! I am Sumit and I am focusing on Dwata again in in 2024. Dwata started off as a passion project for me to help anyone make sense of their business data. I am working to re-launch Dwata as a desktop app to empower anyone to explore their business data, collaborate with team members and get insights using AI.

Dwata can read all business data, no matter where they reside -

- on databases like PostgreSQL, MySQL or MongoDB or
- in SaaS products like Stripe or Shopify
- in your own business software, accessible through an API

With Dwata, you can query visually through an **Excel/Airtable like GUI** from your desktop. Optionally, you can **run Large Language Models** on the cloud and query using **plain English**. ChatGPT integration is also available if you want.

Collaborate with your team or AI bots using **built-in chat**. Share dynamic reports, documentation and notes on your business data. Focus on finding insights and not on learning SQL. Your business data never leaves your computer or cloud account (except if you use ChatGPT or similar SaaS AI).

The Dwata is being built as a desktop app (Windows, MacOS, Linux) and will be completely free to use and open source. Collaboration and AI features will be available with simple subscription.

![Home Screen revamp 2024](docs/assets/Home_view_revamp_2024.png?raw=true "Home Screen revamp 2024")

## Earlier attempts' content follows...

![Home Screen](docs/assets/Home_view_v3.png?raw=true "Home Screen")

## What is dwata?

- Complete software for Business insights and operations
- Query complex data **without any SQL or code**
- Share business insights with entire team
- Onboard team members easily to your Business process
- Keep track of KPIs from any data source, compare Weekly/Monthly/Quarterly growth
- Directly integrates with Stripe, Mailchimp, PayPal, Shippo, etc.
- Build live Reports and Dashboards for customers/suppliers

## Automatically infer (reflect) Database structure

![Automatically infer Database structure](docs/assets/Screencast_DB_Reflect/DB_Reflect.gif?raw=true "Inferring Database structure")
**Uses DB Reflection from SQLAlchemy**

## Modern User Experience

![Grid showing columns](docs/assets/Grid_view_v4.png?raw=true "Grid showing columns")
**Show JOINed tables in a nice way**

## Multi-table merge (1-1, 1-M Relations)

![Merge related data](docs/assets/Grid_Merge_view_v4.png?raw=true "Merge related data")
**There is not SQL to write, everything is visual!**

## Automatically generates SQL

### JOIN, Sub-query, Grouping, Aggregates, etc.

![Generates SQL for JOIN or Sub-query](docs/assets/Generated_SQL_v4.png?raw=true "Generates SQL for JOIN or Sub-query")

## Rich set of UI Elements

![Boolean and large text fields](docs/assets/Detail_view_v4.png?raw=true "Boolean and large text fields")

## Why would you use dwata?

- Created with Sales, Marketing, Analyst or any non-Developer in mind
- No need to invest in Django/Laravel/Rails/Express/... based admin
- Complete auto-pilot software, does not need Developers' help to operate
- Enable and encourage everyone to query Business insights and share

**Building an admin application is an undifferentiated investment that does not add direct value to your customers.**

## Some more details on what it does and how it works:

- dwata scans MySQL/PostgreSQL/SQLite or MongoDB (coming soon)
- **Automatically understands** data schema - Tables, Columns, Relations
- Builds dynamic UI automatically with Grids, Widgets, Column view, etc.
- Visually allows you to **Merge** related data, generates SQL for you!
- Visually apply Aggregates, Averages, Grouping and many other functions (coming soon)
- Can connect directly with Stripe, PayPal, Mailchimp, etc. (coming soon)
- Has Widgets for everything from Numbers, Booleans, Large text
- Dates, Timestamps, Geographic data (with Maps) coming soon
- Full text search coming soon
- Internal cache so Queries are not repeated unnecessarily

**dwata is in early development stage.**
