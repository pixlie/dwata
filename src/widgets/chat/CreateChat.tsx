import { Component, createMemo } from "solid-js";
import withConfiguredForm from "../../utils/configuredForm";
import { ChatCreateUpdate } from "../../api_types/ChatCreateUpdate";
import { Module } from "../../api_types/Module";
import Form from "../interactable/Form";
import { useParams } from "@solidjs/router";

const CreateChat: Component = () => {
  const params = useParams();

  const rootChatId = !!params.threadId ? parseInt(params.threadId) : undefined;

  const configuredForm = withConfiguredForm<ChatCreateUpdate>({
    module: "Chat" as Module,
    initialData: {
      message: "",
      rootChatId,
      // requestedContentFormat: "Text" as ContentFormat,
    },
    postSaveNavigateTo: "/chat",
  });

  const Inner = () => (
    <Form
      configuredForm={configuredForm}
      submitButtomLabel={!!rootChatId ? "Reply" : "Start a chat!"}
      showPrelude={rootChatId !== undefined ? false : undefined}
    />
  );

  if (!!rootChatId) {
    return (
      <div class="p-3 mb-10">
        <Inner />
      </div>
    );
  } else {
    return (
      <div class="max-w-screen-md mx-auto">
        <Inner />
      </div>
    );
  }
};

export default CreateChat;
