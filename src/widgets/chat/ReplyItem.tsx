import { Component } from "solid-js";
import { APIChatReply } from "../../api_types/APIChatReply";

const ReplyItem: Component<APIChatReply> = (props) => {
  return (
    <div class="bg-zinc-800 p-3 rounded-md">
      <p class="text-zinc-400 text-sm">{props.message}</p>
    </div>
  );
};

export default ReplyItem;
