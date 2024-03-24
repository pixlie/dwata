import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { invoke } from "@tauri-apps/api/core";
import { APIGridSchema } from "../api_types/APIGridSchema";

interface IStore {
  schemaForAllSources: { [dataSourceId: string]: Array<APIGridSchema> };

  lastFetchedAt: { [dataSouceId: string]: number };
  isFetching: boolean;
  isReady: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    lastFetchedAt: {},
    isFetching: false,
    isReady: false,
    schemaForAllSources: {},
  });

  return [
    store,
    {
      readSchemaFromAPI: async (dataSourceId: string) => {
        const WAIT_SECONDS = 10;
        // We check that if we have requested this schema then we waited at least WAIT_SECONDS before another request
        if (
          dataSourceId in store.lastFetchedAt &&
          new Date().getSeconds() - store.lastFetchedAt[dataSourceId] <
            WAIT_SECONDS
        ) {
          return;
        }

        if (!dataSourceId) {
          return;
        }

        setStore("isFetching", true);
        // We use the Tauri API to load schema
        const result = await invoke("read_schema", { dataSourceId });
        console.log("read_schema", result);
        setStore(
          "schemaForAllSources",
          dataSourceId,
          result as Array<APIGridSchema>
        );
        setStore((state) => ({
          ...state,
          lastFetchedAt: {
            ...state.lastFetchedAt,
            [dataSourceId]: new Date().getSeconds(),
          },
          isFetching: false,
          isReady: true,
        }));
      },

      getSchemaForGrid: (
        source: string,
        schema: string | null,
        table: string | null
      ): APIGridSchema => {
        if (source in store.schemaForAllSources) {
          const index = store.schemaForAllSources[source].findIndex(
            (x) =>
              (schema === null || x.schema === schema) &&
              (table === null || x.name === table)
          );
          if (index !== -1) {
            return store.schemaForAllSources[source][index];
          }
        }
        throw Error("grid_not_found");
      },

      getAllColumnNameListForTableSource: (
        tableName: string,
        dataSouceId: string
      ): Array<string> => {
        const table =
          dataSouceId in store.schemaForAllSources &&
          store.schemaForAllSources[dataSouceId].find(
            (tn) => tn.name === tableName
          );
        return table ? table.columns.map((col) => col.name) : [];
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const schemaStore = makeStore();

const SchemaContext = createContext<TStoreAndFunctions>(schemaStore);

interface IProviderPropTypes {
  children: JSX.Element;
}

export const SchemaProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <SchemaContext.Provider value={schemaStore}>
      {props.children}
    </SchemaContext.Provider>
  );
};

export const useSchema = () => useContext(SchemaContext);
