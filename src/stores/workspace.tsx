import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes, IWorkspace } from "../utils/types";
import { invoke } from "@tauri-apps/api/core";
import { Module } from "../api_types/Module";
import { Directory } from "../api_types/Directory";
import { ModuleDataReadList } from "../api_types/ModuleDataReadList";

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
          module: "Directory" as Module,
        });
        setStore((state) => ({
          ...state,
          directoryList:
            "Directory" in response
              ? (response.Directory as Array<Directory>)
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
