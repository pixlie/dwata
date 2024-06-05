import { Component } from "solid-js";
// import { SolidMarkdown } from "solid-markdown";
import { useUserInterface } from "../../stores/userInterface";
import { Chat } from "../../api_types/Chat";

const ReplyItem: Component<Chat> = (props) => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div
      class="p-3 rounded-md mb-4 border overflow-x-scroll"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
      }}
    >
      <div style={{ color: getColors().colors["editor.foreground"] }}>
        {/* <SolidMarkdown children={props.message} /> */}
        {props.message}
      </div>
    </div>
  );
};

export default ReplyItem;
