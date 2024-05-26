import { invoke } from "@tauri-apps/api/core";
import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IHeterogenousContent, IProviderPropTypes } from "../utils/types";
import { File } from "../api_types/File";
import { HeterogeneousContentArray } from "../api_types/HeterogeneousContentArray";

interface IStore {
  fileList: Array<File>;
  contents: Array<IHeterogenousContent>;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    fileList: [],
    contents: [],
  });

  return [
    store,
    {
      fetchFileList: async (directoryId: number) => {
        let result = await invoke("fetch_file_list_in_directory", {
          directoryId,
        });

        setStore({ fileList: result as Array<File> });
      },

      fetchContents: async (directoryId: number, relativeFilePath: string) => {
        let result = await invoke("fetch_file_content_list", {
          directoryId,
          relativeFilePath,
        });

        setStore({
          ...store,
          contents: (result as HeterogeneousContentArray).contents,
        });
      },

      generateEmbeddings: async (
        directoryId: string,
        relativeFilePath: string,
      ) => {
        await invoke("generate_text_embedding", {
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
