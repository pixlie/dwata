import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { invoke } from "@tauri-apps/api/core";
import { IProviderPropTypes } from "../utils/types";
import { ModuleDataReadList } from "../api_types/ModuleDataReadList";
import { Chat } from "../api_types/Chat";
import { Module } from "../api_types/Module";
import { ModuleFilters } from "../api_types/ModuleFilters";

interface IStore {
  chatList: Array<Chat>;
  comparisonList: { [rootChatId: number]: Array<number> };
  chatReplyList: { [rootChatId: number]: Array<Chat> };

  isFetching: boolean;
  isReady: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    chatList: [],
    comparisonList: {},
    chatReplyList: {},

    isFetching: false,
    isReady: false,
  });

  return [
    store,
    {
      fetchChats: async () => {
        const result = await invoke<ModuleDataReadList>(
          "read_row_list_for_module",
          {
            module: "Chat" as Module,
          },
        );
        if ("Chat" in result) {
          setStore({ ...store, chatList: result["Chat"] as Array<Chat> });
        }
      },

      fetchChatReplies: async (rootChatId: number) => {
        const result = await invoke<ModuleDataReadList>(
          "read_row_list_for_module_with_filter",
          {
            module: "Chat" as Module,
            filters: {
              Chat: {
                rootChatId,
              },
            } as ModuleFilters,
          },
        );

        if ("Chat" in result) {
          setStore({
            ...store,
            chatReplyList: {
              ...store.chatReplyList,
              [rootChatId]: result["Chat"] as Array<Chat>,
            },
          });
        }
      },

      fetchChatComparisons: async (rootChatId: number) => {
        const result = await invoke<ModuleDataReadList>(
          "read_row_list_for_module_with_filter",
          {
            module: "Chat" as Module,
            filters: {
              Chat: {
                comparedToRootChatId: rootChatId,
              },
            } as ModuleFilters,
          },
        );

        if ("Chat" in result) {
          setStore({
            ...store,
            comparisonList: {
              ...store.comparisonList,
              [rootChatId]: (result["Chat"] as Array<Chat>).map((x) => x.id),
            },
          });

          for (const comparedChatId of store.comparisonList[rootChatId]) {
            const result = await invoke<ModuleDataReadList>(
              "read_row_list_for_module_with_filter",
              {
                module: "Chat" as Module,
                filters: {
                  Chat: {
                    rootChatId: comparedChatId,
                  },
                } as ModuleFilters,
              },
            );

            if ("Chat" in result) {
              setStore({
                ...store,
                chatReplyList: {
                  ...store.chatReplyList,
                  [comparedChatId]: result["Chat"] as Array<Chat>,
                },
              });
            }
          }
        }
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const chatThreadStore = makeStore();

const ChatContext = createContext<TStoreAndFunctions>(chatThreadStore);

export const ChatProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <ChatContext.Provider value={chatThreadStore}>
      {props.children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
