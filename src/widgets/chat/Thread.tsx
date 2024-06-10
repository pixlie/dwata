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

  return (
    <div
      class="my-3 p-3 py-4 rounded-md cursor-pointer border font-normal"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
        color: getColors().colors["editor.foreground"],
        "font-family": `"Noto Sans", sans-serif`,
        "font-optical-sizing": "auto",
      }}
      onClick={handleClick}
    >
      {props.message}
    </div>
  );
};

export default Thread;
