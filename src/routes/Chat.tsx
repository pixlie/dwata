import {
  Component,
  For,
  createComputed,
  createSignal,
  onMount,
} from "solid-js";
import Thread from "../widgets/chat/Thread";
import { Route, RouteSectionProps, useParams } from "@solidjs/router";
import Heading from "../widgets/typography/Heading";
import { ChatThreadProvider, useChatThread } from "../stores/chatThread";
import NewThread from "../widgets/chat/NewThread";
import ReplyItem from "../widgets/chat/ReplyItem";
import { invoke } from "@tauri-apps/api/core";
import { APIAIProvider } from "../api_types/APIAIProvider";
import { useWorkspace } from "../stores/workspace";

const ChatThreadIndex: Component = () => {
  const [
    chatThread,
    { fetchChatThreads, fetchThreadDetail, fetchChatReplies },
  ] = useChatThread();
  const [aiProvidersAndModels, setAiProvidersAndModels] =
    createSignal<Array<APIAIProvider>>();
  const [workspace] = useWorkspace();
  const params = useParams();

  onMount(async () => {
    await fetchChatThreads();
    const response = await invoke<Array<APIAIProvider>>(
      "fetch_list_of_ai_providers_and_models"
    );
    setAiProvidersAndModels(response);
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
      <div class="flex flex-row">
        <div class="w-2/5 mr-4">
          <NewThread />

          <div class="mb-4" />
          <Heading size="3xl">Recent chats with AI</Heading>
          <For each={chatThread.threadList}>
            {(thread) => (
              <Thread
                {...thread}
                aiProviderLabel={
                  workspace.aiIntegrationList.find(
                    (x) => x.id === thread.aiProvider
                  )!.aiProvider
                }
              />
            )}
          </For>
        </div>

        <div class="w-3/5">
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
