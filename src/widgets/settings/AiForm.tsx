import { Component, createMemo, createSignal, onMount } from "solid-js";
import Heading from "../typography/Heading";
import TextInput from "../interactable/TextInput";
import { invoke } from "@tauri-apps/api/core";
import Button from "../interactable/Button";
import Dropdown from "../interactable/Dropdown";
import { APIAIProvider } from "../../api_types/APIAIProvider";
import { useParams } from "@solidjs/router";
import { useWorkspace } from "../../stores/workspace";
import { useUserInterface } from "../../stores/userInterface";

interface IAiFormData {
  id?: string;
  aiProvider: string;
  apiKey: string;
  displayLabel: string;
}

interface IState {
  isEditing: boolean;
  isSaving: boolean;
  isFetching: boolean;
}

const AiForm: Component = () => {
  const [state, setState] = createSignal<IState>({
    isEditing: false,
    isFetching: false,
    isSaving: false,
  });
  const [formData, setFormData] = createSignal<IAiFormData>({
    aiProvider: "",
    apiKey: "",
    displayLabel: "personal",
  });
  const [aiProvidersAndModels, setAiProvidersAndModels] =
    createSignal<Array<APIAIProvider>>();
  const [_, { getColors }] = useUserInterface();
  const [workspace] = useWorkspace();
  const params = useParams();

  onMount(async () => {
    const response = await invoke<Array<APIAIProvider>>(
      "fetch_list_of_ai_providers_and_models"
    );
    setAiProvidersAndModels(response);

    if (!!params.id) {
      const config = workspace.aiIntegrationList.find(
        (x) => x.id === params.id
      );
      if (!!config) {
        setFormData({
          id: config.id,
          aiProvider: config.aiProvider,
          apiKey: config.apiKey || "",
          displayLabel: config.displayLabel || "",
        });
      }
    }
  });

  const getAIProviderChoices = createMemo(() => {
    if (!aiProvidersAndModels()) {
      return [];
    } else {
      return aiProvidersAndModels()!.map((item) => ({
        key: item.name,
        label: item.name,
      }));
    }
  });

  const visibleName = createMemo(() => {
    return !!formData().displayLabel
      ? `- ${formData().displayLabel}`
      : !!formData().aiProvider
        ? `- ${formData().aiProvider}`
        : "";
  });

  const handleChange = (field: string) => {
    return (data: string | number) => {
      setFormData({
        ...formData(),
        [field]: data,
      });
    };
  };

  const handleSubmit = async () => {
    if (!!formData().id) {
      await invoke("update_ai_integration", {
        id: formData().id,
        aiProvider: formData().aiProvider,
        apiKey: formData().apiKey,
        accountLabel: formData().displayLabel,
      });
    } else {
      await invoke("create_ai_integration", {
        aiProvider: formData().aiProvider,
        apiKey: formData().apiKey,
        accountLabel: formData().displayLabel,
      });
    }
  };

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
            <span class="font-bold">Groq</span>{" "}
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
        </ul>
      </div>

      <div class="max-w-screen-sm">
        <div class="bg-zinc-700 px-4 py-3 rounded-md rounded-b-none">
          <Heading size="sm">AI Provider {visibleName()}</Heading>
        </div>

        <div class="bg-zinc-800 px-4 pt-3 pb-4 rounded-md rounded-t-none">
          <Dropdown
            label="Select an AI Provider"
            choices={getAIProviderChoices()}
            isRequired
            value={formData().aiProvider}
            onSelect={handleChange("aiProvider")}
            size="sm"
          />

          <div class="mt-4" />
          <TextInput
            type="text"
            isRequired
            label="API Key"
            value={formData().apiKey}
            onInput={handleChange("apiKey")}
          />

          <div class="mt-4" />
          <TextInput
            type="text"
            isRequired
            label="Account Label"
            value={formData().displayLabel}
            onInput={handleChange("displayLabel")}
          />

          <div class="mt-4" />
          <Button label="Save and start a chat!" onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
};

export default AiForm;
