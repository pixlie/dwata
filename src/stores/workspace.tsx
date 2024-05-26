import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes, IWorkspace } from "../utils/types";
import { invoke } from "@tauri-apps/api/core";
import { Module } from "../api_types/Module";
import { ModuleDataReadList } from "../api_types/ModuleDataReadList";
import { DirectorySource } from "../api_types/DirectorySource";

const makeStore = () => {
  const [store, setStore] = createStore<IWorkspace>({
    directoryList: [],

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
        const response: ModuleDataReadList = await invoke("read_module_list", {
          module: "DirectorySource" as Module,
        });
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
