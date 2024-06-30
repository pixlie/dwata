import {
  Component,
  For,
  createComputed,
  createMemo,
  createResource,
} from "solid-js";
import Thread from "../widgets/chat/Thread";
import { useLocation, useParams } from "@solidjs/router";
import Heading from "../widgets/typography/Heading";
import { useChat } from "../stores/chatThread";
import ChatForm from "../widgets/chat/CreateChat";
import ReplyItem from "../widgets/chat/ReplyItem";

interface LocationProps {
  pathname: string;
  search: string;
  hash: string;
}

const CompareChats: Component = () => {
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
    <div class="pb-4 h-full">
      <ReplyItem {...getRootChat()!} isRootChat isComparing index={0} />

      <div class="flex flex-col h-full">
        <div class="w-96 overflow-y-auto pr-3">
          <For each={chat.chatReplyList[parseInt(params.threadId)]}>
            {(reply, index) => <ReplyItem {...reply} index={index()} />}
          </For>

          <ChatForm
            defaultAIModel={getRootChat()!.requestedAiModel || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default CompareChats;
