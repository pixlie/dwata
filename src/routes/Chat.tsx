import { Component, For, createComputed, createResource } from "solid-js";
import ThreadItem from "../widgets/chat/ThreadItem";
import {
  Route,
  RouteSectionProps,
  useLocation,
  useParams,
} from "@solidjs/router";
import Heading from "../widgets/typography/Heading";
import { ChatProvider, useChat } from "../stores/chat";
import { NewChatForm } from "../widgets/chat/ChatForm";
import CompareChats from "./CompareChats";
import ThreadView from "../widgets/chat/ThreadView";

interface LocationProps {
  pathname: string;
  search: string;
  hash: string;
}

const ChatThreadIndex: Component = () => {
  const [chat, { fetchChats, fetchChatReplies }] = useChat();
  const params = useParams();
  const location = useLocation();
  const [_x, { refetch }] = createResource(async () => {
    await fetchChats();
    if (!!params.threadId) {
      await fetchChatReplies(parseInt(params.threadId));
    }
  });

  createComputed<LocationProps>(
    (prev) => {
      if (
        prev.pathname !== location.pathname ||
        prev.search !== location.search ||
        prev.hash !== location.hash
      ) {
        refetch();
      }
      return {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      } as LocationProps;
    },
    {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    } as LocationProps,
  );

  createComputed(async () => {
    if (!!params.threadId) {
      refetch();
    }
  });

  return (
    <div class="flex h-full">
      <div class="w-2/5 overflow-y-auto pr-4">
        <Heading size="3xl">Chats with AI</Heading>
        <For
          each={chat.chatList.filter((x) => x.comparedToRootChatId === null)}
        >
          {(thread) => <ThreadItem {...thread} />}
        </For>
      </div>

      <div class="w-3/5 overflow-y-auto pr-3">
        {!!params.threadId ? (
          <ThreadView rootChatId={parseInt(params.threadId)} />
        ) : null}
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
      <Route path="/compare/:threadId" component={CompareChats} />
      <Route path="/start" component={NewChatForm} />

      <Route path="/" component={ChatThreadIndex} />
    </ChatProvider>
  );
};

export { ChatWrapper, ChatRoutes };
