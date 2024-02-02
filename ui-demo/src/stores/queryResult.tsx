import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IQueryResult } from "../utils/types";

const makeStore = (initial: IQueryResult) => {
  const [store, setStore] = createStore<IQueryResult>(initial);

  return [
    store,
    {
      setQueryResult: (result: IQueryResult) => {
        setStore(result);
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;

const QueryResultContext = createContext<TStoreAndFunctions>();

interface IProviderPropTypes {
  initial: IQueryResult;
  children: JSX.Element;
}

export const QueryResultProvider: Component<IProviderPropTypes> = (props) => {
  const queryStore = makeStore(props.initial);

  return (
    <QueryResultContext.Provider value={queryStore}>
      {props.children}
    </QueryResultContext.Provider>
  );
};

export const useQueryResult = () => useContext(QueryResultContext);
