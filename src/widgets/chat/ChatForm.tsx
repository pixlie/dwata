import { Component } from "solid-js";
import { Module } from "../../api_types/Module";
import Form from "../interactable/ConfiguredForm";
import { useLocation } from "@solidjs/router";

interface IPropTypes {
  rootChatId?: number;
  defaultAIModel?: string;
}

const ChatForm: Component<IPropTypes> = (props) => {
  const location = useLocation();

  if (props.rootChatId !== undefined) {
    const postSaveNavigateTo = location.pathname.includes("compare")
      ? `/chat/compare/${props.rootChatId}?newReply=true`
      : `/chat/thread/${props.rootChatId}?newReply=true`;

    return (
      <div class="p-3 mb-10">
        <Form
          module={"Chat" as Module}
          initialData={{
            message: "",
            rootChatId: props.rootChatId,
            requestedAiModel: props.defaultAIModel,
          }}
          postSaveNavigateTo={postSaveNavigateTo}
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
          }}
          postSaveNavigateTo="/chat"
          submitButtomLabel={"Start a chat!"}
        />
      </div>
    );
  }
};

export const NewChatForm: Component = () => <ChatForm />;

export default ChatForm;
