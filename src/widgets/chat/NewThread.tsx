import { Component, createMemo, createSignal, onMount } from "solid-js";
import Form from "../interactable/Form";
import { IFormField } from "../../utils/types";
import { invoke } from "@tauri-apps/api/core";
import Button from "../interactable/Button";
import Dropdown, { IChoicesWithHeading } from "../interactable/Dropdown";
import { APIAIProvider } from "../../api_types/APIAIProvider";
import { APIAIModel } from "../../api_types/APIAIModel";

interface IFormState {
  isFormOpen: boolean;
}

interface INewThreadFormData {
  message: string;
  aiProvider: string;
  aiModel: string;
}

const NewThread: Component = () => {
  const [formData, setFormData] = createSignal<INewThreadFormData>({
    message: "",
    aiProvider: "OpenAI",
    aiModel: "gpt-4-turbo-preview",
  });
  const [aiProvidersAndModels, setAiProvidersAndModels] =
    createSignal<Array<APIAIProvider>>();

  const formFields: Array<IFormField> = [
    {
      name: "message",
      fieldType: "multiLineText",
      isRequired: true,
    },
  ];

  const handleNewThread = async () => {
    await invoke("start_chat_thread", {
      message: formData().message,
      aiProvider: formData().aiProvider,
      aiModel: formData().aiModel,
    });
  };

  onMount(async () => {
    const response = await invoke<Array<APIAIProvider>>(
      "fetch_list_of_ai_providers_and_models"
    );
    setAiProvidersAndModels(response);
  });

  const getAiModelChoices = createMemo(() => {
    if (!!aiProvidersAndModels()) {
      return aiProvidersAndModels()?.reduce(
        (collector: Array<IChoicesWithHeading>, item: APIAIProvider) => [
          ...collector,
          {
            name: item.name,
            choices: item.aiModelList.map((model: APIAIModel) => ({
              key: model.apiName,
              label: model.label,
            })),
          },
        ],
        []
      );
    }
    return [];
  });

  return (
    <Form
      title="Start a new chat"
      formFields={formFields}
      // submitButtomLabel="Start"
      // handleSubmit={handleNewThread}
      setFieldInput={setFormData}
      submitButton={
        <div class="flex flex-row">
          <div class="grow">
            <Button size="sm" label="Start a chat" onClick={handleNewThread} />
          </div>
          <Dropdown
            label="Select an AI model"
            choicesWithHeadings={getAiModelChoices()}
            size="sm"
          />
        </div>
      }
    ></Form>
  );
};

export default NewThread;
