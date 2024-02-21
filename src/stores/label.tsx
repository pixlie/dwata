import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IChatRoom } from "../utils/types";
import { invoke } from "@tauri-apps/api/core";

interface IStore {
  labels: Array<IChatRoom>;
  isFetching: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    labels: [],
    isFetching: false,
  });

  return [
    store,
    {
      loadLabels: async () => {
        // We use the Tauri invoke API to call the Rust backend
        invoke("load_labels").then((result) => {
          setStore("labels", result as Array<IChatRoom>);
        });
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const labelStore = makeStore();

const LabelContext = createContext<TStoreAndFunctions>(labelStore);

interface IProviderPropTypes {
  children: JSX.Element;
}

export const DataSourceProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <LabelContext.Provider value={labelStore}>
      {props.children}
    </LabelContext.Provider>
  );
};

export const useLabel = () => useContext(LabelContext);
