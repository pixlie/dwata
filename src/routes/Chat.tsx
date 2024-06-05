import { Component, For, createComputed, onMount } from "solid-js";
import Thread from "../widgets/chat/Thread";
import { Route, RouteSectionProps, useParams } from "@solidjs/router";
import Heading from "../widgets/typography/Heading";
import { ChatProvider, useChat } from "../stores/chatThread";
import CreateChat from "../widgets/chat/CreateChat";
import ReplyItem from "../widgets/chat/ReplyItem";

const ChatThreadIndex: Component = () => {
  const [chat, { fetchChats, fetchChatReplies }] = useChat();
  const params = useParams();

  onMount(async () => {
    await fetchChats();
  });

  createComputed(async () => {
    if (!!params.threadId) {
      const threadId = parseInt(params.threadId);
      await fetchChatReplies(threadId);
    }
  });

  return (
    <div class="flex gap-4 h-full">
      <div class="w-2/5 overflow-y-auto pr-4">
        <Heading size="3xl">Chats with AI</Heading>
        <For each={chat.chatList}>{(thread) => <Thread {...thread} />}</For>
      </div>

      <div class="w-3/5 overflow-y-auto">
        {!!params.threadId && (
          <For each={chat.chatReplyList[parseInt(params.threadId)]}>
            {(reply) => <ReplyItem {...reply} />}
          </For>
        )}
      </div>
    </div>
  );
};

const ChatWrapper: Component<RouteSectionProps> = (props) => {
  return <>{props.children}</>;
};

const ChatRoutes: Component = () => {
  return (
    <ChatProvider>
      <Route path="/thread/:threadId" component={ChatThreadIndex} />
      <Route path="/start" component={CreateChat} />

      <Route path="/" component={ChatThreadIndex} />
    </ChatProvider>
  );
};

export { ChatWrapper, ChatRoutes };
