import { Component, For, createComputed, onMount } from "solid-js";
import Thread from "../widgets/chat/Thread";
import { Route, RouteSectionProps, useParams } from "@solidjs/router";
import Heading from "../widgets/typography/Heading";
import { ChatProvider, useChat } from "../stores/chatThread";
import CreateChat from "../widgets/chat/CreateChat";
import ReplyItem from "../widgets/chat/ReplyItem";
import Button from "../widgets/interactable/Button";
import { invoke } from "@tauri-apps/api/core";

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

  const handleResendChatsToAI = () => {
    // We invoke the Tauri API to resend chats in this thread to AI models
    // We send only the first chat (which was initiated by the user)

    invoke("chat_with_ai", {
      chatId: chat.chatReplyList[parseInt(params.threadId)][0].id,
    });
  };

  return (
    <div class="flex gap-4 h-full">
      <div class="w-2/5 overflow-y-auto pr-4">
        <Heading size="3xl">Chats with AI</Heading>
        <For each={chat.chatList}>{(thread) => <Thread {...thread} />}</For>
      </div>

      <div class="w-3/5 overflow-y-auto">
        <Button onClick={handleResendChatsToAI} label="Resend chats to AI" />
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
