import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { APIChatThread } from "../api_types/APIChatThread";
import { invoke } from "@tauri-apps/api/core";
import { APIChatReply } from "../api_types/APIChatReply";
import { IProviderPropTypes } from "../utils/types";

interface IStore {
  threadList: Array<APIChatThread>;
  threadDetail?: APIChatThread;
  replyListForThread?: Array<APIChatReply>;

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
        const result = await invoke("fetch_chat_thread_list");
        setStore({ ...store, threadList: result as Array<APIChatThread> });
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
