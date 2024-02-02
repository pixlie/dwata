import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IQuery, IQueryResult } from "../utils/types";

interface IStore {
  isReady: boolean;
  isFetching: boolean;
  query?: IQuery;
  result?: IQueryResult;

  areRowsSelectable?: boolean;
  visibleColumnIndices?: Array<number>; // index of columns in select array
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    isReady: false,
    isFetching: false,
  });

  return [
    store,
    {
      setQuery: (query: IQuery) => {
        setStore("query", query);
      },
      setQueryResult: (result: IQueryResult) => {
        setStore(result);
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
