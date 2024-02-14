import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes } from "../utils/types";
import { invoke } from "@tauri-apps/api/core";
import { IConfig } from "../api_types/IConfig";

interface IStore extends IConfig {
  isReady: boolean;
  isFetching: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    dataSourceList: [],
    isReady: false,
    isFetching: false,
  });

  return [
    store,
    {
      readConfigFromAPI: async () => {
        // We invoke the Tauri API to load workspace
        const response = await invoke("read_config");
        console.log(response as IConfig);
        setStore({
          ...(response as IConfig),
          isReady: true,
          isFetching: false,
        });
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
