import {
  Component,
  For,
  createComputed,
  createMemo,
  createResource,
} from "solid-js";
import Thread from "../widgets/chat/Thread";
import {
  Route,
  RouteSectionProps,
  useLocation,
  useParams,
} from "@solidjs/router";
import Heading from "../widgets/typography/Heading";
import { ChatProvider, useChat } from "../stores/chatThread";
import ChatForm from "../widgets/chat/CreateChat";
import ReplyItem from "../widgets/chat/ReplyItem";
import CompareChats from "./CompareChats";
import Button from "../widgets/interactable/Button";
import getColors from "../utils/colors/gitHubDark";

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

  const getRootChat = createMemo(() =>
    chat.chatList.find((x) => x.id === parseInt(params.threadId)),
  );

  return (
    <div class="flex h-full">
      <div class="w-2/5 overflow-y-auto pr-4">
        <Heading size="3xl">Chats with AI</Heading>
        <For each={chat.chatList}>{(thread) => <Thread {...thread} />}</For>
      </div>

      <div class="w-3/5 overflow-y-auto pr-3">
        {!!getRootChat() ? (
          <>
            <ReplyItem {...getRootChat()!} isRootChat index={0} />

            <div
              class="mb-4 font-thin"
              style={{ color: getColors().colors["editor.foreground"] }}
            >
              <Button
                size="sm"
                href={`/chat/compare/${params.threadId}`}
                label="Compare"
              />{" "}
              responses from different AI models
            </div>

            <For each={chat.chatReplyList[parseInt(params.threadId)]}>
              {(reply, index) => <ReplyItem {...reply} index={index()} />}
            </For>

            <ChatForm
              defaultAIModel={getRootChat()!.requestedAiModel || undefined}
            />
          </>
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
      <Route path="/start" component={ChatForm} />

      <Route path="/" component={ChatThreadIndex} />
    </ChatProvider>
  );
};

export { ChatWrapper, ChatRoutes };
