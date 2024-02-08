import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes, IWorkspace } from "../utils/types";
import { invoke } from "@tauri-apps/api/core";

interface IStore extends IWorkspace {}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    databaseList: [],
    apiList: [],
    folderList: [],
  });

  return [
    store,
    {
      loadWorkspace: (): void => {
        // We invoke the Tauri API to load workspace
        invoke("load_workspace").then((response) => {
          setStore(response as IStore);
        });
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const workspaceStore = makeStore();

const WorkspaceContext = createContext<TStoreAndFunctions>(workspaceStore);

export const UserProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <WorkspaceContext.Provider value={workspaceStore}>
      {props.children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
