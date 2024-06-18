import { Component } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import withConfiguredForm from "../../utils/configuredForm";
import { Module } from "../../api_types/Module";
import { useParams } from "@solidjs/router";
import Form from "../interactable/ConfiguredForm";
import { AIIntegrationCreateUpdate } from "../../api_types/AIIntegrationCreateUpdate";

const AIIntegrationForm: Component = () => {
  const [_, { getColors }] = useUserInterface();
  const params = useParams();

  const configuredForm = withConfiguredForm<AIIntegrationCreateUpdate>({
    module: "AIIntegration" as Module,
    existingItemId: !!params.id ? parseInt(params.id) : undefined,
    initialData: {
      label: "OpenAI personal",
      aiProvider: "OpenAI",
      apiKey: "",
    },
    postSaveNavigateTo: "/settings",
  });

  return (
    <>
      <div class="max-w-screen-sm">
        <p style={{ color: getColors().colors["editor.foreground"] }}>
          Pricing and API key links for AI providers (register/login if you have
          not):
        </p>

        <ul
          class="mb-4 list-disc"
          style={{ color: getColors().colors["editor.foreground"] }}
        >
          <li class="ml-8">
            <span class="font-bold">OpenAI</span>:{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              class="underline text-blue-600"
            >
              API keys
            </a>
            ,{" "}
            <a
              href="https://openai.com/pricing"
              target="_blank"
              class="underline text-blue-600"
            >
              pricing
            </a>
          </li>

          <li class="ml-8">
            <span class="font-bold">Groq</span>:{" "}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              class="underline text-blue-600"
            >
              API keys
            </a>
            ,{" "}
            <a
              href="https://wow.groq.com"
              target="_blank"
              class="underline text-blue-600"
            >
              pricing
            </a>
          </li>

          <li class="ml-8">
            <span class="font-bold">Ollama</span>: localhost only for now, API
            keys not needed
          </li>
        </ul>
      </div>

      <div class="max-w-screen-sm">
        <Form
          formConfiguration={configuredForm.formConfiguration}
          formData={configuredForm.formData}
          handleChange={configuredForm.handleChange}
          handleSubmit={configuredForm.handleSubmit}
        />
      </div>
    </>
  );
};

export default AIIntegrationForm;
