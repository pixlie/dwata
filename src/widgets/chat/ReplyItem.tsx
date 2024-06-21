import { Component, createMemo, onMount } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { Chat } from "../../api_types/Chat";
import { marked } from "marked";
import { Role } from "../../api_types/Role";
import { ProcessStatus } from "../../api_types/ProcessStatus";
import { useChat } from "../../stores/chatThread";
import { useParams } from "@solidjs/router";
import Button from "../interactable/Button";
import { invoke } from "@tauri-apps/api/core";

interface IPropTypes extends Chat {
  index: number;
  isRootChat?: boolean;
}

const ReplyItem: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const [chat] = useChat();
  const params = useParams();
  let refMarkedContent: HTMLDivElement | undefined;

  onMount(() => {
    if (
      !props.isRootChat &&
      props.role === ("assistant" as Role) &&
      !!props.message &&
      !!refMarkedContent
    ) {
      // This is an AI generated message, show as Markdown
      refMarkedContent.innerHTML = marked.parse(props.message);
    }
  });

  const getPreviousChat = createMemo(() => {
    if (props.index === 0) {
      return chat.chatList.find(
        (chat) => chat.id === parseInt(params.threadId),
      );
    } else {
      return chat.chatReplyList[parseInt(params.threadId)][props.index - 1];
    }
  });

  const handleResendChat = () => {
    invoke("chat_with_ai", {
      chatId: props.id,
    });
  };

  return (
    <>
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
            <i class="fa-solid fa-robot" />{" "}
            {!!getPreviousChat() ? getPreviousChat()?.requestedAiModel : "AI"}:
          </div>
        )}

        <div
          class={`${props.isRootChat ? "text-2xl leading-8 font-semibold" : "leading-6 font-normal"} overflow-x-auto font-content markdown`}
          style={{
            "font-optical-sizing": "auto",
            color: getColors().colors["editor.foreground"],
          }}
          ref={refMarkedContent}
        >
          {props.message}
        </div>

        {props.isRootChat ? (
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

      {props.processStatus === ("pending" as ProcessStatus) ? (
        <div
          class="p-3 rounded-md border overflow-x-scroll mb-4"
          style={{
            "background-color": getColors().colors["inlineChat.background"],
            "border-color": getColors().colors["inlineChat.border"],
          }}
        >
          <div
            class="mb-2 font-normal"
            style={{
              color: getColors().colors["editor.foreground"],
              "font-optical-sizing": "auto",
            }}
          >
            Getting response from AI...
          </div>
          <div class="animate-pulse">
            <div class="w-2/3 h-4 bg-gray-700 rounded mb-2"></div>
            <div class="w-full h-8 bg-gray-600 rounded mb-2"></div>
            <div class="w-full h-8 bg-gray-700 rounded mb-2"></div>
            <div class="w-1/2 h-8 bg-gray-600 rounded"></div>
          </div>

          <div class="flex mt-4">
            <div
              class="grow font-thin text-sm content-center"
              style={{
                color: getColors().colors["editor.foreground"],
              }}
            >
              Resend chat to AI, only after 2 minutes
            </div>
            <div>
              <Button
                size="sm"
                label="Resend to AI"
                onClick={handleResendChat}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ReplyItem;
