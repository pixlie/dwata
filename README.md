# Dwata

Dwata is a desktop app to chat with any AI model and get insights from your data. Chats are threaded, like in Discord and each thread can connect to a different AI model. Dwata can connect databases, APIs (like Stripe) or CSV files and send structure/data as prompt **when you** need.

![Recent chats with AI models](docs/assets/Home_screen_recent_chat_threads.png?raw=true "Recent chats with AI models")

## Introduction

Hello! I am Sumit and Dwata is a product that I have tried building a few times. I was focused on a GUI based product earlier but I feel AI models can be a better interface. I am working on this full-time since late 2023 and am close to the minimum viable product (MVP).

## What does it solve?

AI models have shown really good results in understanding human language and bridging the gap to interacting with computers. Dwata starts with chats and then allows you to (explicitly) add data or structure (of the data) to the chats. The response from AI will most probably have SQL or Python code which can then be used to get the insights needed.

Dwata can check AI generated SQL to see if tables or columns referred are correct, else ask the AI again for corrections. When the SQL looks good, you can query your database from Dwata itself and see the results.

![Results from SQL query](docs/assets/Home_view_revamp_2024.png?raw=true "Results from SQL query")

Similarly Python code (usually with Pandas) will also be executable from within Dwata. This is way out in the future as I first want to get the SQL part working minimally.

## What AI models can I connect to?

I am adding support for these (API integrations):

- [OpenAI](https://platform.openai.com/docs/models) - GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- [Groq](https://console.groq.com/docs/models) - LLaMA2-70b, Mixtral-8x7b
- [Phind](https://www.phind.com/blog/introducing-phind-70b) - Phind-34B, Phind-70B (API behind waitlist)
- [Anthropic](https://www.anthropic.com/product) - Claude (API behind waitlist)
- [Ollama](https://github.com/ollama/ollama?tab=readme-ov-file#model-library) - Llama 2, Mistral, Phi-2 Gemma, etc.

## SaaS models vs local/self-hosted models

There are many available AI models at the moment and the catalog is growing. While companies like OpenAI or Anthropic only allow API based access to their private models, you can also use any of the open source (or source available) models running on your laptop or a cloud server. Ollama is a very good application for this purpose. This gives you privacy for your data since the AI model is running in your private compute environment.

## Can I compare chat from different models?

Yes! In Dwata, you start a chat thread with an AI model. Then you can go into the thread and select to `compare` to any number of other models.

I am creating a side by side view mode for this where your interactions are sent directly to all selected models in compare mode.

## What data sources can Dwata connect to?

Dwata will be able to read data from:

- Databases like PostgreSQL, MySQL or MongoDB
- SaaS products like Stripe or Shopify (API or CSV)
- Your own custom software (CSV or API)
- CSV files/folders
- Email (IMAP)

## Does Dwata read any of my private/business data?

No, the desktop app does not send me (or my company) any of your private data. I intend to add product analytics and error tracking but you will have explicit control over the analytics or error data I collect. You will see the the tracking data being sent to my server and can agree or disagree to participate.

## How will Dwata make money?

Private collaboration: the desktop app is and will remain free (both in source code and price). If you want to share your reports, insights or action items with your team, then you will have to take a subscription (not available yet).

**dwata is in early development stage.**
