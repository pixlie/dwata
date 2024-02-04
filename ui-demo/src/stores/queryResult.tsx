import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IQuery, IQueryResult, IResult } from "../utils/types";

const makeStore = () => {
  const [store, setStore] = createStore<IQueryResult>({
    isReady: false,
    isFetching: false,
  });

  return [
    store,
    {
      setQuery: (query: IQuery) => {
        for (const column in query.select) {
          if (column[0] === "*") {
            // We have to expande into all columns from schema
          }
        }
        setStore("query", query);
      },
      setQueryResult: (result: IResult) => {
        setStore("result", result);
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
