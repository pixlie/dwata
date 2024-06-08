import { Component } from "solid-js";
import Heading from "../typography/Heading";
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
      class="my-3 p-3 py-4 rounded-md cursor-pointer border"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
      }}
      onClick={handleClick}
    >
      <Heading size="base">{props.message}</Heading>
    </div>
  );
};

export default Thread;
