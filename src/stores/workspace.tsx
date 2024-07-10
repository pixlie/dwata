import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes, IWorkspace } from "../utils/types";
import { invoke } from "@tauri-apps/api/core";
import { Module } from "../api_types/Module";
import { ModuleDataReadList } from "../api_types/ModuleDataReadList";
import { DirectorySource } from "../api_types/DirectorySource";
import { DatabaseSource } from "../api_types/DatabaseSource";
import { AIIntegration } from "../api_types/AIIntegration";
import { OAuth2 } from "../api_types/OAuth2";

const makeStore = () => {
  const [store, setStore] = createStore<IWorkspace>({
    directoryList: [],
    databaseList: [],
    aiIntegrationList: [],
    oAuth2List: [],
    emailAccountList: [],

    isReady: false,
    isFetching: false,
  });

  return [
    store,
    {
      readDirectoryList: async () => {
        if (store.isFetching) {
          return;
        }
        setStore({
          ...store,
          isFetching: true,
        });
        // We invoke the Tauri API to load workspace
        const response: ModuleDataReadList = await invoke<ModuleDataReadList>(
          "read_row_list_for_module",
          {
            module: "DirectorySource" as Module,
          },
        );
        setStore((state) => ({
          ...state,
          directoryList:
            "DirectorySource" in response
              ? (response.DirectorySource as Array<DirectorySource>)
              : [],
          isReady: true,
          isFetching: false,
        }));
      },

      readDatabaseList: async () => {
        if (store.isFetching) {
          return;
        }
        setStore({
          ...store,
          isFetching: true,
        });
        // We invoke the Tauri API to load workspace
        const response: ModuleDataReadList = await invoke<ModuleDataReadList>(
          "read_row_list_for_module",
          {
            module: "DatabaseSource" as Module,
          },
        );
        setStore((state) => ({
          ...state,
          databaseList:
            "DatabaseSource" in response
              ? (response.DatabaseSource as Array<DatabaseSource>)
              : [],
          isReady: true,
          isFetching: false,
        }));
      },

      readAIIntegrationList: async () => {
        if (store.isFetching) {
          return;
        }
        setStore({
          ...store,
          isFetching: true,
        });
        // We invoke the Tauri API to load workspace
        const response: ModuleDataReadList = await invoke<ModuleDataReadList>(
          "read_row_list_for_module",
          {
            module: "AIIntegration" as Module,
          },
        );
        setStore((state) => ({
          ...state,
          aiIntegrationList:
            "AIIntegration" in response
              ? (response.AIIntegration as Array<AIIntegration>)
              : [],
          isReady: true,
          isFetching: false,
        }));
      },

      readOAuth2List: async () => {
        if (store.isFetching) {
          return;
        }
        setStore({
          ...store,
          isFetching: true,
        });
        // We invoke the Tauri API to load workspace
        const response: ModuleDataReadList = await invoke<ModuleDataReadList>(
          "read_row_list_for_module",
          {
            module: "OAuth2" as Module,
          },
        );
        setStore((state) => ({
          ...state,
          oAuth2List:
            "OAuth2" in response ? (response.OAuth2 as Array<OAuth2>) : [],
        }));
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const workspaceStore = makeStore();

const WorkspaceContext = createContext<TStoreAndFunctions>(workspaceStore);

export const WorkspaceProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <WorkspaceContext.Provider value={workspaceStore}>
      {props.children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
