import { Component, onMount } from "solid-js";
import { useChatThread } from "../../stores/chatThread";

const ChatThreadLoader: Component = () => {
  const [_, { fetchChatThreads }] = useChatThread();

  onMount(async () => {
    console.log("fetching");
    await fetchChatThreads();
  });

  return <></>;
};

export default ChatThreadLoader;
