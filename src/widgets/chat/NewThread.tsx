import { Component, For, createMemo, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import Button from "../interactable/Button";
import Dropdown, { IChoicesWithHeading } from "../interactable/Dropdown";
import { APIAIProvider } from "../../api_types/APIAIProvider";
import { APIAIModel } from "../../api_types/APIAIModel";
import { useWorkspace } from "../../stores/workspace";
import { useNavigate } from "@solidjs/router";
import { useUserInterface } from "../../stores/userInterface";
import TextArea from "../interactable/TextArea";
import Heading from "../typography/Heading";
import ChatContext from "./ChatContext";

interface INewThreadFormData {
  message: string;
  aiProvider: string | null;
  aiModel: string | null;
}

interface IFormState {
  chatContexts: Array<string>;
}

const NewThread: Component = () => {
  const [formData, setFormData] = createSignal<INewThreadFormData>({
    message: "",
    aiProvider: null,
    aiModel: null,
  });
  const [formState, setFormState] = createSignal<IFormState>({
    chatContexts: [],
  });
  const [aiProvidersAndModels, setAiProvidersAndModels] =
    createSignal<Array<APIAIProvider>>();
  const [workspace] = useWorkspace();
  const navigate = useNavigate();
  const [_, { getColors }] = useUserInterface();

  const handleNewThread = async () => {
    console.log(formData());
    if (!formData().message || !formData().aiProvider || !formData().aiModel) {
      return;
    }

    const response: [number, number] = await invoke("start_chat_thread", {
      message: formData().message,
      aiProvider: formData().aiProvider,
      aiModel: formData().aiModel,
    });
    navigate(`/chat/${response[0]}`);
  };

  onMount(async () => {
    const firstProvider = workspace.aiIntegrationList[0];
    const response = await invoke<Array<APIAIProvider>>(
      "fetch_list_of_ai_providers_and_models"
    );
    setAiProvidersAndModels(response);
    const firstModel = response.find(
      (provider) => provider.name === firstProvider.aiProvider
    )?.aiModelList[0];

    setFormData({
      ...formData(),
      aiProvider: firstProvider.aiProvider,
      aiModel: firstModel?.apiName || null,
    });
  });

  const getAiModelChoices = createMemo(() => {
    if (!aiProvidersAndModels()) {
      return [];
    }
    return aiProvidersAndModels()!.reduce(
      (collector: Array<IChoicesWithHeading>, item: APIAIProvider) => {
        const aiIntegration = workspace.aiIntegrationList.find(
          (x) => x.aiProvider === item.name
        );
        if (!aiIntegration) {
          return collector;
        }
        return [
          ...collector,
          {
            name: item.name,
            choices: item.aiModelList.map((model: APIAIModel) => ({
              key: aiIntegration.aiProvider + "/" + model.apiName,
              label: model.label,
            })),
          },
        ];
      },
      []
    );
  });

  const handleMessageInput = (value: string) =>
    setFormData({
      ...formData(),
      message: value,
    });

  const handleModelSelect = (selected: string) => {
    const [aiProvider, aiModel] = selected.split("/");
    setFormData({
      ...formData(),
      aiProvider,
      aiModel,
    });
  };

  const handleContextButtonClick = () => {
    setFormState({
      ...formState(),
      chatContexts: [...formState().chatContexts, ""],
    });
  };

  return (
    <div class="max-w-screen-lg rounded-md m-auto relative">
      <div class="mt-1">
        <Heading size="xl">Start a new chat with AI</Heading>
      </div>

      <TextArea
        label="Your message"
        value={formData().message}
        onInput={handleMessageInput}
      />
      <For each={formState().chatContexts}>
        {(chatContext) => <ChatContext chatContextId={chatContext} />}
      </For>

      <div class="flex my-2 items-center">
        <div class="grow">
          <Button
            size="lg"
            label="Start a new chat"
            onClick={handleNewThread}
          />
        </div>

        <Button
          size="sm"
          label="+ Context from sources"
          onClick={handleContextButtonClick}
        />

        <div class="mr-4" />

        <Dropdown
          label="AI model"
          choicesWithHeadings={getAiModelChoices()}
          size="sm"
          value={
            !!formData().aiProvider && !!formData().aiModel
              ? `${formData().aiProvider}/${formData().aiModel}`
              : undefined
          }
          onSelect={handleModelSelect}
        />
      </div>
    </div>
  );
};

export default NewThread;
