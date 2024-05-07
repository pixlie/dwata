import { invoke } from "@tauri-apps/api/core";
import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes } from "../utils/types";
import { APIFileNode } from "../api_types/APIFileNode";

interface IStore {
  fileList: Array<APIFileNode>;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    fileList: [],
  });

  return [
    store,
    {
      fetchFileList: async (folderId: string) => {
        let result = await invoke("fetch_file_list_in_directory", {
          folderId,
        });

        setStore({ fileList: result as Array<APIFileNode> });
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const directoryStore = makeStore();

const DirectoryContext = createContext<TStoreAndFunctions>(directoryStore);

export const DirectoryProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <DirectoryContext.Provider value={directoryStore}>
      {props.children}
    </DirectoryContext.Provider>
  );
};

export const useDirectory = () => useContext(DirectoryContext);
