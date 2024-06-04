import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { invoke } from "@tauri-apps/api/core";
import { IProviderPropTypes } from "../utils/types";
import { ChatThread } from "../api_types/ChatThread";
import { ChatReply } from "../api_types/ChatReply";
import { ModuleDataReadList } from "../api_types/ModuleDataReadList";

interface IStore {
  threadList: Array<ChatThread>;
  threadDetail?: ChatThread;
  replyListForThread?: Array<ChatReply>;

  isFetching: boolean;
  isReady: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    threadList: [],
    isFetching: false,
    isReady: false,
  });

  return [
    store,
    {
      fetchChatThreads: async () => {
        const result = await invoke<ModuleDataReadList>(
          "fetch_chat_thread_list",
        );
        setStore({ ...store, threadList: result as Array<ChatThread> });
      },

      fetchThreadDetail: async (threadId: number) => {
        const result = await invoke("fetch_chat_thread_detail", { threadId });
        setStore({
          ...store,
          threadDetail: result as APIChatThread,
        });
      },

      fetchChatReplies: async (threadId: number) => {
        const result = await invoke("fetch_chat_reply_list", { threadId });
        setStore({
          ...store,
          replyListForThread: result as Array<APIChatReply>,
        });
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const chatThreadStore = makeStore();

const ChatThreadContext = createContext<TStoreAndFunctions>(chatThreadStore);

export const ChatThreadProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <ChatThreadContext.Provider value={chatThreadStore}>
      {props.children}
    </ChatThreadContext.Provider>
  );
};

export const useChatThread = () => useContext(ChatThreadContext);
