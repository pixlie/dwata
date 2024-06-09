# Dwata

#### A general purpose, multi-model and multimodal AI Studio

> [!WARNING]
>
> Dwata is in a very early and rapid stage of development.
> It is missing some basic UX to continue a conversation with AI but it is getting close to an MVP.
> Please feel free to check Projects or Issues on GitHub for this project to get an idea of the status of development.

## What does Dwata solve?

Let us imagine regular tasks or problems in our daily lives. How to market our website, manage our finances better or even coming up with gift suggestions. Really it could be any daily topic where we need a sounding board or an organiser.

In Dwata, we can have a chat with AI (Artificial Intelligence). We break the problem into small chunks. The AI model(s) can ask for further information (access to website, emails, financial details, business database...). We try to come to some insight, actional item(s), a reminder or set of future tasks to tackle the original problem. That's it. It is your personal assistant.

![Recent chats with AI models](docs/assets/Home_screen_recent_chat_threads_0.0.2.png?raw=true "Recent chats with AI models")

## What does general purpose mean?

Dwata is not geared toward a type of problem. It centers around the fact that recent AI models have become really good at comprehending human language. It is a new interface to the computer.

In Dwata, we start with chats on any daily topic that needs our attention. Then we (explicitly) give Dwata access to our data to be shared with AI. Dwata helps in reading data from many different sources and making it easy to be shared with AI. Dwata helps in figuring out the steps that an AI may want us to take, say access further data, set a calendar reminder or run a piece of code.

Therefore, Dwata does not focus on a type of problem and should be able to behave as an assistant to our day to day issues.

## What AI models can I connect to?

Dwata is a multi-model app, as in it supports (or will support) connecting to AI models from these providers:

- [OpenAI](https://platform.openai.com/docs/models) - GPT-40, GPT-4, GPT-4 Turbo, GPT-3.5 Turbo, ...
- [Groq](https://console.groq.com/docs/models) - Llama 3, LlaMA2-70b, Mixtral-8x7b, ...
- [Anthropic](https://www.anthropic.com/product) - Claude 3, ...
- [Ollama](https://ollama.com/library) - Llama 3, Llama 2, Mistral, Phi-2 Gemma, ...

## What is multimodal?

Dwata is being built to be able to help us have conversations that include any type of "content", like text (usual chat conversations), code (like JavaScript), image (photo of a product for example), audio (speech to text for example) or even video (detect objects or even video creation). These content can be both input to AI or output from AI.

## What is an AI Studio?

A Studio here means that Dwata is a general purpose software that allows mixing different questions, data and AI to accomplish our daily goals. We can save these as workflows and share with others. Thereby we can enable others to make AI based assistants easily.

## What data sources can Dwata connect to?

Dwata will be able to read data from:

- Databases like PostgreSQL, MySQL or MongoDB
- SaaS products like Stripe or Shopify (API or CSV)
- Your own custom software (CSV or API)
- CSV files/folders
- Email (IMAP)

## Can I compare chat from different models?

Yes! In Dwata, you start a chat thread with an AI model. Then you can go into the thread and select to `compare` to any number of other models.

Dwata will have a side by side view mode for this where your interactions are sent directly to all selected models in compare mode.

## Does Dwata send any of my private/business data to your company?

No, Dwata does not send me, Sumit, or my company, any of your private data. Your data will be sent to AI as per your choice in the chats.

Dwata will send basic product usage analytics and error reports to our company servers if you choose to send these. You will be asked explicitly.

## How will Dwata make money?

Private collaboration: the desktop app is and will remain free (both in source code and price).

If you want to collaborate and work privately with your team, then you will have to take a subscription (pricing should start at USD 60 per user per year).

Please remember that you pay for your AI model usage costs yourself (OpenAI, Anthropic, Groq, etc).
