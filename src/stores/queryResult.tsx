import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { APIGridQuery } from "../api_types/APIGridQuery";
import { invoke } from "@tauri-apps/api/core";
import { APIGridData } from "../utils/types";

interface IStore {
  query: Array<APIGridQuery>;
  data: Array<APIGridData>;
  areRowsSelectable: boolean;
  errors: string[];
  isReady: boolean;
  isFetching: boolean;

  // UI related
  isTableBrowserOpen: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    query: [],
    data: [],
    areRowsSelectable: false,
    errors: [],
    isReady: false,
    isFetching: false,

    // UI related
    isTableBrowserOpen: false,
  });

  return [
    store,
    {
      setGrid: (grid: APIGridQuery) => {
        const i = store.query.findIndex(
          (x) =>
            x.source === grid.source &&
            x.schema === grid.schema &&
            x.table === grid.table
        );
        if (i !== -1) {
          // This grid exists, update the columns
          setStore("query", i, grid);
        } else {
          setStore("query", [grid]);
        }
      },

      setQuery: (query: Array<APIGridQuery>) => {
        setStore("query", query);
      },

      fetchResults: async () => {
        const data = await invoke("load_data", {
          select: [
            ...store.query.map((grid) => ({
              source: grid.source,
              schema: grid.schema,
              table: grid.table,
              columns: grid.columns,
              ordering: null,
              filtering: null,
            })),
          ],
        });
        setStore({
          ...store,
          isReady: true,
          isFetching: true,
          data: data as Array<APIGridData>,
        });
      },

      toggleTableBrowser: () => {
        setStore("isTableBrowserOpen", !store.isTableBrowserOpen);
      },

      setTableBrowser: (state: boolean) => {
        setStore("isTableBrowserOpen", state);
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
const queryResultStore = makeStore();

const QueryResultContext = createContext<TStoreAndFunctions>(queryResultStore);

interface IProviderPropTypes {
  children: JSX.Element;
}

export const QueryResultProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <QueryResultContext.Provider value={queryResultStore}>
      {props.children}
    </QueryResultContext.Provider>
  );
};

export const useQueryResult = () => useContext(QueryResultContext);
