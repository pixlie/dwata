import { invoke } from "@tauri-apps/api/core";
import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes } from "../utils/types";
import { APIFileNode } from "../api_types/APIFileNode";
import { APIFileContent } from "../api_types/APIFileContent";

interface IStore {
  fileList: Array<APIFileNode>;
  contents: Array<[number, APIFileContent]>;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    fileList: [],
    contents: [],
  });

  return [
    store,
    {
      fetchFileList: async (directoryId: string) => {
        let result = await invoke("fetch_file_list_in_directory", {
          directoryId,
        });

        setStore({ fileList: result as Array<APIFileNode> });
      },

      fetchContents: async (directoryId: string, relativeFilePath: string) => {
        let result = await invoke("fetch_file_contents", {
          directoryId,
          relativeFilePath,
        });

        setStore({
          ...store,
          contents: result as Array<[number, APIFileContent]>,
        });
      },

      generateEmbeddings: async (
        directoryId: string,
        relativeFilePath: string
      ) => {
        let result = await invoke("generate_text_embedding", {
          directoryId,
          relativeFilePath,
        });
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
