import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useUserInterface } from "../../stores/userInterface";
import { Chat } from "../../api_types/Chat";

const Thread: Component<Chat> = (props) => {
  const navigate = useNavigate();
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

  return (
    <div
      class="my-3 p-3 rounded-md cursor-pointer border text-lg overflow-hidden text-ellipsis"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
        color: getColors().colors["editor.foreground"],
        "font-family": `"Noto Sans", sans-serif`,
        "font-optical-sizing": "auto",
      }}
      onClick={handleClick}
    >
      {message()}
    </div>
  );
};

export default Thread;
