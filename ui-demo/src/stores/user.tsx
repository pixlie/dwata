import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

interface IStore {
  firstName?: string;
  lastName?: string;
  email?: string;
  salutation?: "Mr." | "Mrs." | "Ms.";
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({});

  return [store, {}] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const userStore = makeStore();

const UserContext = createContext<TStoreAndFunctions>(userStore);

interface IProviderPropTypes {
  children: JSX.Element;
}

export const UserProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <UserContext.Provider value={userStore}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
