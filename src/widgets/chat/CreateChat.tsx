import { Component } from "solid-js";
import { Module } from "../../api_types/Module";
import Form from "../interactable/ConfiguredForm";
import { useParams } from "@solidjs/router";

const ChatForm: Component = () => {
  const params = useParams();

  if (!!params.threadId) {
    return (
      <div class="p-3 mb-10">
        <Form
          module={"Chat" as Module}
          initialData={{
            message: "",
            rootChatId: !!params.threadId
              ? parseInt(params.threadId)
              : undefined,
            // requestedContentFormat: "Text" as ContentFormat,
          }}
          postSaveNavigateTo={
            !!params.threadId ? `/chat/thread/${params.threadId}` : "/chat"
          }
          submitButtomLabel={"Reply"}
          showPrelude={false}
        />
      </div>
    );
  } else {
    return (
      <div class="max-w-screen-md mx-auto">
        <Form
          module={"Chat" as Module}
          initialData={{
            message: "",
            rootChatId: !!params.threadId
              ? parseInt(params.threadId)
              : undefined,
            // requestedContentFormat: "Text" as ContentFormat,
          }}
          postSaveNavigateTo={
            !!params.threadId ? `/chat/thread/${params.threadId}` : "/chat"
          }
          submitButtomLabel={"Start a chat!"}
        />
      </div>
    );
  }
};

export default ChatForm;
