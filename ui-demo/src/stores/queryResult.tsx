import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { DwataQuery } from "../api_types/DwataQuery";
import { DwataData } from "../api_types/DwataData";

interface IStore {
  query: DwataQuery;
  data: DwataData;
  areRowsSelectable: boolean;
  errors: string[];
  isReady: boolean;
  isFetching: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    query: {
      select: [],
      ordering: null,
      filtering: null,
    },
    data: {
      columns: [],
      rowsOfColumns: [],
    },
    areRowsSelectable: false,
    errors: [],
    isReady: false,
    isFetching: false,
  });

  return [
    store,
    {
      setQuery: (query: DwataQuery) => {
        for (const column in query.select) {
          if (column[0] === "*") {
            // We have to expande into all columns from schema
          }
        }
        setStore("query", query);
      },
      setQueryResult: (data: DwataData) => {
        setStore({
          ...store,
          isReady: true,
          isFetching: true,
          data,
        });
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
