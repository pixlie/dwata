import { Component } from "solid-js";
import Button from "../interactable/Button";
// import ChatContext from "./ChatContext";
import withConfiguredForm from "../../utils/configuredForm";
import { ChatCreateUpdate } from "../../api_types/ChatCreateUpdate";
import { Module } from "../../api_types/Module";
import Form from "../interactable/Form";
import { useParams } from "@solidjs/router";

const CreateChat: Component = () => {
  // const [formState, setFormState] = createSignal<IFormState>({
  //   chatContexts: [],
  // });
  const params = useParams();

  const configuredForm = withConfiguredForm<ChatCreateUpdate>({
    module: "Chat" as Module,
    initialData: {
      message: "",
      rootChatId: "threadId" in params ? parseInt(params.threadId) : undefined,
      // requestedContentFormat: "Text" as ContentFormat,
    },
    postSaveNavigateTo: "/chat",
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
