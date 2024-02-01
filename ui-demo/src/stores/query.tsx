import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IQuery } from "../utils/types";

const makeStore = (initial: IQuery) => {
  const [store, setStore] = createStore<IQuery>(initial);

  return [store, {}] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;

const QueryContext = createContext<TStoreAndFunctions>();

interface IProviderPropTypes {
  initial: IQuery;
  children: JSX.Element;
}

export const QueryProvider: Component<IProviderPropTypes> = (props) => {
  const queryStore = makeStore(props.initial);

  return (
    <QueryContext.Provider value={queryStore}>
      {props.children}
    </QueryContext.Provider>
  );
};

export const useQuery = () => useContext(QueryContext);
