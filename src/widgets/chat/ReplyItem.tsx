import { Component } from "solid-js";
import { APIChatReply } from "../../api_types/APIChatReply";
import { SolidMarkdown } from "solid-markdown";

const ReplyItem: Component<APIChatReply> = (props) => {
  return (
    <div class="bg-zinc-800 p-3 rounded-md">
      <div class="text-zinc-400 text-sm">
        <SolidMarkdown children={props.message} />
      </div>
    </div>
  );
};

export default ReplyItem;
