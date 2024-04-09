import { Component, createMemo, createSignal, onMount } from "solid-js";
import Form from "../interactable/Form";
import { IFormField } from "../../utils/types";
import { invoke } from "@tauri-apps/api/core";
import Button from "../interactable/Button";
import Dropdown, { IChoicesWithHeading } from "../interactable/Dropdown";
import { APIAIProvider } from "../../api_types/APIAIProvider";
import { APIAIModel } from "../../api_types/APIAIModel";
import { useWorkspace } from "../../stores/workspace";
import { useNavigate } from "@solidjs/router";

interface INewThreadFormData {
  message: string;
  aiProvider: string | null;
  aiModel: string | null;
}

const NewThread: Component = () => {
  const [formData, setFormData] = createSignal<INewThreadFormData>({
    message: "",
    aiProvider: null,
    aiModel: null,
  });
  const [aiProvidersAndModels, setAiProvidersAndModels] =
    createSignal<Array<APIAIProvider>>();
  const [workspace, { readConfigFromAPI }] = useWorkspace();
  const navigate = useNavigate();

  const formFields: Array<IFormField> = [
    {
      name: "message",
      fieldType: "multiLineText",
      isRequired: true,
    },
  ];

  const handleNewThread = async () => {
    const response: [number, number] = await invoke("start_chat_thread", {
      message: formData().message,
      aiProvider: formData().aiProvider,
      aiModel: formData().aiModel,
    });
    navigate(`/chat/thread/${response[0]}`);
  };

  onMount(async () => {
    await readConfigFromAPI();
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

  const handleModelSelect = (selected: string) => {
    const [aiProvider, aiModel] = selected.split("/");
    setFormData({
      ...formData(),
      aiProvider,
      aiModel,
    });
  };

  return (
    <Form
      title="Start a new chat"
      formFields={formFields}
      // submitButtomLabel="Start"
      // handleSubmit={handleNewThread}
      setFieldInput={setFormData}
      submitButton={
        <div class="flex">
          <div class="grow">
            <Button size="sm" label="Start a chat" onClick={handleNewThread} />
          </div>

          <Dropdown
            label="Select an AI model"
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
      }
    ></Form>
  );
};

export default NewThread;
