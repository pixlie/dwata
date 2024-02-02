import { Component } from "solid-js";
import Heading from "../typography/Heading";

const ChatBar: Component = () => {
  return (
    <div class="flex h-full flex-col px-3 pb-2">
      <div class="grow">
        <Heading size="xl">Conversations</Heading>
      </div>

      <textarea class="mt-4 h-24 w-full grow-0 rounded-md border border-gray-500 bg-zinc-800 p-3 text-gray-50"></textarea>
    </div>
  );
};

export default ChatBar;
