import { Component } from "solid-js";
import { APIChatReply } from "../../api_types/APIChatReply";
import { SolidMarkdown } from "solid-markdown";
import { useUserInterface } from "../../stores/userInterface";

const ReplyItem: Component<APIChatReply> = (props) => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div
      class="p-3 rounded-md mb-4 border"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
      }}
    >
      <div style={{ color: getColors().colors["editor.foreground"] }}>
        <SolidMarkdown children={props.message} />
      </div>
    </div>
  );
};

export default ReplyItem;
