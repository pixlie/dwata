import { Component, createMemo } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { useUserInterface } from "../../stores/userInterface";
import { Chat } from "../../api_types/Chat";

const ThreadItem: Component<Chat> = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [_, { getColors }] = useUserInterface();

  const handleClick = () => {
    navigate(`/chat/thread/${props.id}`);
  };

  const message = () => {
    if (!!props.message) {
      return props.message.length > 150
        ? props.message.slice(0, 150) + "..."
        : props.message;
    } else {
      return "";
    }
  };

  const isCurrentThread = createMemo(() => {
    if (!!params.threadId && props.id === parseInt(params.threadId)) {
      return true;
    }
    return false;
  });

  return (
    <div
      class={`my-3 p-3 rounded-md cursor-pointer ${isCurrentThread() ? "border-r-8" : ""} border text-lg overflow-hidden font-content`}
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
        color: getColors().colors["editor.foreground"],
        "font-optical-sizing": "auto",
      }}
      onClick={handleClick}
    >
      {message()}
    </div>
  );
};

export default ThreadItem;
