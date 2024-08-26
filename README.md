# dwata

## Communications: managed
One app for your emails, calendars, files, Slack, LinkedIn and much more. Blazing fast search, offline access for unlimited accounts.

Open source and runs on your laptop for complete privacy. dwata **does not** send any data (not even product analytics) outside your computer without your explicit permission.

> [!WARNING]
>
> dwata is in a very early stage of development.

## Emails, files, Slack... a thousand paper cuts

Getting everything in one place, searching across mutliple accounts, keeping track of todos, delegating information with others can all take up a lot of our daily time. Some days we are on top of our digital life, while on other days they drag us down.

If you relate to these:

- Do you keep multiple open browser tabs for your digital life?
- Do you struggle to search across all private data in one place?
- Do you travel often and need offline access to your data?
- Do you share multiple inboxes with partner or colleagues?
- Would you like some help in organising emails, files - like auto labelling folders?
- Would you like someone to check what emails need to be shared with your partner or co-founder so they are updated?
- And many more on these lines...

Then dwata is for you.

## How does dwata work?

dwata is an open source desktop app that gathers all your private data on to your laptop, manages them for you according to your workflow:

- Offline access to all stored data
- Blazing fast search on all documents (email, attachments, files, calendar...)
- Shows up contacts, events, tasks and much more from your data
- Will soon connect to Slack, Shopify, Stripe, LinkedIn and many others
- Can read from databases like MySQL, PostgreSQL...
- Uses AI to label documents, get summary of documents (email threads)

## Why should I trust dwata?

Good question. I am Sumit, founder of dwata and I am building dwata with my best intentions to make sure our daily lives have less cognitive overhead.

In order to make sure that you can trust dwata, it is completely open source. dwata does not have any hidden telemetry - sends no data to my company (Pixlie, in India) without your explicit permission. All product analytics is stored inside dwata and is sent only after you see and confirm.

I take your privacy very seriously. I do not even have OAuth2 apps for Google to access your data - you have to create those yourself (there is documentation in the app).

AI providers can be run locally if you want to avoid hosted providers like OpenAI, Anthropic, etc.

## How do I install dwata?

> [!WARNING]
>
> Please keep in mind that dwata is in a very early stage of development and there may be bugs.

- [Install dwata on your computer](./docs/INSTALL.md)
- [Compile dwata from sources](./docs/SETUP.md)

## What AI providers can I use?

If you want to use hosted AI providers with your own API keys you can use these:

- [OpenAI](https://platform.openai.com/docs/models)
- [Groq](https://console.groq.com/docs/models)
- [Anthropic](https://www.anthropic.com/product) - coming soon

If you want to run AI models on your computer (support for cloud run coming soon) you can use these:

- [Ollama](https://ollama.com/library)
- [Llamafile](https://github.com/Mozilla-Ocho/llamafile)

## What data sources can (will) dwata connect to?

dwata will be able to read data from:

- Receive emails with IMAP (tested with Gmail, Proton Mail)
- Databases like PostgreSQL, MySQL or MongoDB
- SaaS products like Stripe or Shopify (API or CSV)
- Your own custom software (CSV or API)
- CSV files/folders
- Email (IMAP)

## Does dwata send any of my private/business data to your company?

No, dwata does not send me, Sumit, or my company, any of your private data. Your data will be sent to AI as per your choice in the chats.

dwata will send basic product usage analytics and error reports to our company servers if you choose to send these. You will be asked explicitly.

## How will dwata make money?

dwata is completely free to use. You may add as much data as your computer can handle.

_Please remember that you pay for your AI model usage costs yourself (OpenAI, Anthropic, Groq, etc)_

**Pro version**: I will create a pro version of dwata that will have features which will need a license (pricing will come after this is available). License check will be made once a day with an API request (with your permission). Source code of the app will remain under an open source license.

**Team collaboration**: If you want to collaborate and share data privately with others, then you will have to purchase a subscription (pricing will come after this is available). Data shared will use encryption while in transmission.
