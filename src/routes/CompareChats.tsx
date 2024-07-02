import {
  Component,
  For,
  createComputed,
  createMemo,
  createResource,
} from "solid-js";
import { useLocation, useParams } from "@solidjs/router";
import { useChat } from "../stores/chat";
import ChatForm from "../widgets/chat/ChatForm";
import ReplyItem from "../widgets/chat/ReplyItem";
import CreateChatComparison from "../widgets/chat/CreateChatComparison";
import Heading from "../widgets/typography/Heading";
import { useUserInterface } from "../stores/userInterface";

interface LocationProps {
  pathname: string;
  search: string;
  hash: string;
}

const CompareChats: Component = () => {
  const [chat, { fetchChatReplies, fetchChatComparisons }] = useChat();
  const params = useParams();
  const location = useLocation();
  const [_, { getColors }] = useUserInterface();
  const getRootChatId = createMemo(() => parseInt(params.threadId));

  const [_x, { refetch }] = createResource(async () => {
    if (!!params.threadId) {
      await fetchChatReplies(getRootChatId());
      await fetchChatComparisons(getRootChatId());
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
    chat.chatList.find((x) => x.id === getRootChatId()),
  );

  if (!params.threadId || !getRootChat()) {
    return null;
  }

  return (
    <div class="h-full">
      <ReplyItem {...getRootChat()!} isComparing index={0} />

      <div class="flex flex-row h-full">
        <div class="w-96 overflow-y-auto pr-3 pb-16">
          <For each={chat.chatReplyList[getRootChatId()]}>
            {(reply, index) => <ReplyItem {...reply} index={index()} />}
          </For>

          <ChatForm
            rootChatId={getRootChatId()}
            defaultAIModel={getRootChat()!.requestedAiModel || undefined}
          />
        </div>

        <For each={chat.comparisonList[getRootChatId()]}>
          {(comparisonChatId) => (
            <div class="w-96 overflow-y-auto pr-3 pb-16">
              <For each={chat.chatReplyList[comparisonChatId]}>
                {(reply, index) => <ReplyItem {...reply} index={index()} />}
              </For>

              <ChatForm
                rootChatId={comparisonChatId}
                defaultAIModel={
                  chat.chatList.find((x) => x.id === comparisonChatId)!
                    .requestedAiModel || undefined
                }
              />
            </div>
          )}
        </For>

        <div
          class="w-96 p-3 rounded-md border self-center"
          style={{
            "border-color": getColors().colors["inlineChat.border"],
          }}
        >
          <Heading size="xl">Compare another AI model</Heading>
          <CreateChatComparison message={getRootChat()!.message || ""} />
        </div>
      </div>
    </div>
  );
};

export default CompareChats;
