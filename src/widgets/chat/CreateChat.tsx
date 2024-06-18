import { Component, createMemo } from "solid-js";
import withConfiguredForm from "../../utils/configuredForm";
import { ChatCreateUpdate } from "../../api_types/ChatCreateUpdate";
import { Module } from "../../api_types/Module";
import Form from "../interactable/ConfiguredForm";
import { useParams } from "@solidjs/router";

const ChatForm: Component = () => {
  const params = useParams();

  const getConfiguredForm = createMemo(() => {
    return withConfiguredForm<ChatCreateUpdate>({
      module: "Chat" as Module,
      initialData: {
        message: "",
        rootChatId: !!params.threadId ? parseInt(params.threadId) : undefined,
        // requestedContentFormat: "Text" as ContentFormat,
      },
      postSaveNavigateTo: !!params.threadId
        ? `/chat/thread/${params.threadId}`
        : "/chat",
    });
  });

  if (!!params.threadId) {
    return (
      <div class="p-3 mb-10">
        <Form
          formConfiguration={getConfiguredForm().formConfiguration}
          formData={getConfiguredForm().formData}
          handleChange={getConfiguredForm().handleChange}
          handleSubmit={getConfiguredForm().handleSubmit}
          submitButtomLabel={"Reply"}
          showPrelude={false}
        />
      </div>
    );
  } else {
    return (
      <div class="max-w-screen-md mx-auto">
        <Form
          formConfiguration={getConfiguredForm().formConfiguration}
          formData={getConfiguredForm().formData}
          handleChange={getConfiguredForm().handleChange}
          handleSubmit={getConfiguredForm().handleSubmit}
          submitButtomLabel={"Start a chat!"}
        />
      </div>
    );
  }
};

export default ChatForm;
