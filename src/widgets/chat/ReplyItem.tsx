import { Component, createMemo, onMount } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { Chat } from "../../api_types/Chat";
import { marked } from "marked";
import { Role } from "../../api_types/Role";
import { useChat } from "../../stores/chat";
import { invoke } from "@tauri-apps/api/core";

interface IPropTypes extends Chat {
  index: number;
  isComparing?: boolean;
}

const ReplyItem: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const [chat] = useChat();
  let refMarkedContent: HTMLDivElement | undefined;

  onMount(() => {
    if (
      props.rootChatId !== null &&
      props.role === ("assistant" as Role) &&
      !!props.message &&
      !!refMarkedContent
    ) {
      // This is an AI generated message, show as Markdown
      const parsed = marked.parse(props.message);
      if (typeof parsed === "string") {
        refMarkedContent.innerHTML = parsed;
      }
    }
  });

  /* This function is used to find the AI model that was used to create this
  chat reply. This information is available in the previous message. */
  const getRequestedAIModel = createMemo(() => {
    if (props.index === 0) {
      return chat.chatList.find((chat) => chat.id === props.rootChatId)
        ?.requestedAiModel;
    } else {
      return chat.chatReplyList[props.rootChatId][props.index - 1]
        ?.requestedAiModel;
    }
  });

  return (
    <div
      class="p-3 rounded-md border overflow-x-scroll mb-4"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
      }}
    >
      {props.role === "user" ? (
        <div
          style={{
            color: getColors().colors["editor.foreground"],
          }}
        >
          <i class="fa-solid fa-user pr-2" /> Me:
        </div>
      ) : (
        <div
          style={{
            color: getColors().colors["editor.foreground"],
          }}
        >
          <i class="fa-solid fa-robot" /> {getRequestedAIModel()}:
        </div>
      )}

      <div
        class={`${props.rootChatId === null ? "text-2xl leading-8 font-semibold" : "leading-6 font-normal"} overflow-x-auto font-content markdown`}
        style={{
          "font-optical-sizing": "auto",
          color: getColors().colors["editor.foreground"],
        }}
        ref={refMarkedContent}
      >
        {props.message}
      </div>

      {props.rootChatId === null && !props.isComparing ? (
        <div class="flex">
          <div class="grow" />
          <div
            class="text-sm mt-2 px-1 rounded font-thin opacity-60"
            style={{
              "background-color": getColors().colors["editor.foreground"],
              color: getColors().colors["editor.background"],
            }}
          >
            Requested: {props.requestedAiModel}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReplyItem;
