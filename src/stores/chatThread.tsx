import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { APIChatThread } from "../api_types/APIChatThread";
import { invoke } from "@tauri-apps/api/core";

interface IStore {
  threads: Array<APIChatThread>;

  isFetching: boolean;
  isReady: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    threads: [],
    isFetching: false,
    isReady: false,
  });

  return [
    store,
    {
      fetchChatThreads: async () => {
        let result = await invoke("fetch_chat_threads");
        console.log(result);
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const chatThreadStore = makeStore();

const ChatThreadContext = createContext<TStoreAndFunctions>(chatThreadStore);

interface IProviderPropTypes {
  children: JSX.Element;
}

export const ChatThreadProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <ChatThreadContext.Provider value={chatThreadStore}>
      {props.children}
    </ChatThreadContext.Provider>
  );
};

export const useChatThread = () => useContext(ChatThreadContext);
