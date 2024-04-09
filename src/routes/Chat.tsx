import { Component, For, createComputed, onMount } from "solid-js";
import Thread from "../widgets/chat/Thread";
import { Route, RouteSectionProps, useParams } from "@solidjs/router";
import Heading from "../widgets/typography/Heading";
import { ChatThreadProvider, useChatThread } from "../stores/chatThread";
import NewThread from "../widgets/chat/NewThread";
import ReplyItem from "../widgets/chat/ReplyItem";

const ChatThreadIndex: Component = () => {
  const [
    chatThread,
    { fetchChatThreads, fetchThreadDetail, fetchChatReplies },
  ] = useChatThread();
  const params = useParams();

  onMount(async () => {
    await fetchChatThreads();
  });

  createComputed(async () => {
    if (!!params.threadId) {
      const threadId = parseInt(params.threadId);
      await fetchThreadDetail(threadId);
      await fetchChatReplies(threadId);
    }
  });

  return (
    <>
      <div class="flex h-full">
        <div class="w-2/5 mr-4">
          <NewThread />

          <div class="mb-4" />
          <Heading size="3xl">Recent chats with AI</Heading>
          <For each={chatThread.threadList}>
            {(thread) => <Thread {...thread} />}
          </For>
        </div>

        <div class="w-3/5 overflow-y-auto h-full">
          {!!params.threadId && (
            <For each={chatThread.replyListForThread}>
              {(reply) => <ReplyItem {...reply} />}
            </For>
          )}
        </div>
      </div>
    </>
  );
};

const ChatWrapper: Component<RouteSectionProps> = (props) => {
  return <>{props.children}</>;
};

const ChatRoutes: Component = () => {
  return (
    <ChatThreadProvider>
      {/* <Route path="/start" component={DatabaseForm} /> */}
      <Route path="/thread/:threadId" component={ChatThreadIndex} />

      <Route path="/" component={ChatThreadIndex} />
    </ChatThreadProvider>
  );
};

export { ChatWrapper, ChatRoutes };
