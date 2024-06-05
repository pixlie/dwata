import { Component, createSignal } from "solid-js";
import Button from "../interactable/Button";
import ChatContext from "./ChatContext";
import withConfiguredForm from "../../utils/configuredForm";
import { ChatCreateUpdate } from "../../api_types/ChatCreateUpdate";
import { ContentFormat } from "../../api_types/ContentFormat";
import { Module } from "../../api_types/Module";
import Form from "../interactable/Form";

interface INewThreadFormData {
  message: string;
  aiProvider: string | null;
  aiModel: string | null;
}

interface IFormState {
  chatContexts: Array<string>;
}

const CreateChat: Component = () => {
  const [formData, setFormData] = createSignal<INewThreadFormData>({
    message: "",
    aiProvider: null,
    aiModel: null,
  });
  const [formState, setFormState] = createSignal<IFormState>({
    chatContexts: [],
  });

  const configuredForm = withConfiguredForm<ChatCreateUpdate>({
    module: "Chat" as Module,
    initialData: {
      message: "",
      requestedContentFormat: "Text" as ContentFormat,
    },
    navtigateToAfterSave: "/chat",
  });

  return (
    <div class="max-w-screen-md mx-auto">
      <Form configuredForm={configuredForm} submitButtomLabel="Start a chat!" />

      {/* <For each={formState().chatContexts}>
        {(chatContext) => <ChatContext chatContextId={chatContext} />}
      </For> */}

      <div class="flex my-2 items-center">
        <div class="grow">
          <Button
            size="lg"
            label="Start a new chat"
            // onClick={handleNewThread}
          />
        </div>

        <Button
          size="sm"
          label="+ Context from sources"
          // onClick={handleContextButtonClick}
        />
      </div>
    </div>
  );
};

export default CreateChat;
