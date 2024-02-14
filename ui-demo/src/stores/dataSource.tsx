import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IDataSource } from "../api_types/IDataSource";
import { invoke } from "@tauri-apps/api/core";

interface IStore {
  sources: Array<IDataSource>;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    sources: [],
  });

  return [
    store,
    {
      loadDataSources: async () => {
        // We use the Tauri invoke API to call the Rust backend
        invoke("load_data_sources").then((result) => {
          setStore("sources", result as Array<IDataSource>);
        });
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const dataSourceStore = makeStore();

const DataSourceContext = createContext<TStoreAndFunctions>(dataSourceStore);

interface IProviderPropTypes {
  children: JSX.Element;
}

export const DataSourceProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <DataSourceContext.Provider value={dataSourceStore}>
      {props.children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => useContext(DataSourceContext);
