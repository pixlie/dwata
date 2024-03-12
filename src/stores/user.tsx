import { invoke } from "@tauri-apps/api/core";
import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { APIUserAccount } from "../api_types/APIUserAccount";

interface IStore {
  account?: APIUserAccount;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({});

  return [
    store,
    {
      fetchCurrentUser: async () => {
        let result = await invoke("fetch_current_user");
        setStore({ ...store, account: result as APIUserAccount });
      },
    },
  ] as const; // `as const` forces tuple type inference
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
