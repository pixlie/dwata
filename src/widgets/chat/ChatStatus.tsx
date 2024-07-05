import { Component } from "solid-js";
import { Chat } from "../../api_types/Chat";
import { ProcessStatus } from "../../api_types/ProcessStatus";
import { useUserInterface } from "../../stores/userInterface";
import Button from "../interactable/Button";
import { invoke } from "@tauri-apps/api/core";

const ChatStatus: Component<Chat> = (props) => {
  const [_, { getColors }] = useUserInterface();

  const handleResendChat = () => {
    invoke("chat_with_ai", {
      chatId: props.id,
    });
  };

  if (props.processStatus === ("pending" as ProcessStatus)) {
    return (
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
            Resend to AI (after 2 minutes)
          </div>
          <div>
            <Button size="sm" label="Resend" onClick={handleResendChat} />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default ChatStatus;
