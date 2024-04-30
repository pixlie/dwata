# Dwata

Dwata is an AI studio where you can chat with any model about your data. You can mix and match different AI models (from OpenAI, Anthropic, Groq, etc.) in the same chat. You can create embeddings, search for similarity, chain the responses and actions to create workflows. No coding required. Dwata can connect to databases, APIs (like Stripe) or Markdown/text/CSV/Excel files and send structure/data as prompt **when you** need.

**Dwata is in early development stage, please do not expect it to work without errors**

![Recent chats with AI models](docs/assets/Home_screen_recent_chat_threads_0.0.2.png?raw=true "Recent chats with AI models")

## Introduction

Hello! we are Sumit and Sudeshna, from India. Dwata is a product that Sumit has tried building a few times before. It was originally supposed to be a data exploration app with no coding knowledge needed. We are re-imagining Dwata as a completely no-code app to explore all your data and get meaningful insights or build interesting solutions on top (see https://suprt.com as an example we are building with Dwata).

## What does it solve?

AI models have shown really good results in understanding human language and bridging the gap to interacting with computers. Dwata starts with chats and then allows you to (explicitly) add data or structure (of the data) to the chats. The response from AI will most probably have SQL or Python code which can then be used to get the insights needed.

Dwata can check AI generated SQL to see if tables or columns referred are correct, else ask the AI again for corrections. When the SQL looks good, you can query your database from Dwata itself and see the results.

Similarly Python code (usually with Pandas) will also be executable from within Dwata. This is way out in the future as I first want to get the SQL part working minimally.

## What AI models can I connect to?

Dwata has or will support the following:

- [OpenAI](https://platform.openai.com/docs/models) - GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- [Groq](https://console.groq.com/docs/models) - LLaMA2-70b, Mixtral-8x7b
- [Phind](https://www.phind.com/blog/introducing-phind-70b) - Phind-34B, Phind-70B (API behind waitlist)
- [Anthropic](https://www.anthropic.com/product) - Claude (API behind waitlist)
- [Ollama](https://github.com/ollama/ollama?tab=readme-ov-file#model-library) - Llama 2, Mistral, Phi-2 Gemma, etc.

## SaaS models vs local/self-hosted models

There are many available AI models at the moment and the catalog is growing. While companies like OpenAI or Anthropic only allow API based access to their private models, you can also use any of the open source (or source available) models running on your laptop or a cloud server. Ollama is a very good application for this purpose. This gives you privacy for your data since the AI model is running in your private compute environment.

## Can I compare chat from different models?

Yes! In Dwata, you start a chat thread with an AI model. Then you can go into the thread and select to `compare` to any number of other models.

Dwata will have a side by side view mode for this where your interactions are sent directly to all selected models in compare mode.

## What data sources can Dwata connect to?

Dwata will be able to read data from:

- Databases like PostgreSQL, MySQL or MongoDB
- SaaS products like Stripe or Shopify (API or CSV)
- Your own custom software (CSV or API)
- CSV files/folders
- Email (IMAP)

## Does Dwata read any of my private/business data?

No, the desktop app does not send me (or my company) any of your private data. Dwata will collect product analytics and error reports but you will have full control over the data we receive and can choose to not send these.

## How will Dwata make money?

Private collaboration: the desktop app is and will remain free (both in source code and price). If you want collaborate and work with Dwata in your team, then you will have to take a subscription (pricing should start at USD 60 per user per year). Please remember that you pay for your AI model usage costs directly (OpenAI, Anthropic, Groq, etc).
