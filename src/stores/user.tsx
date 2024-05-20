import { invoke } from "@tauri-apps/api/core";
import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { UserAccount } from "../api_types/UserAccount";
import { IProviderPropTypes } from "../utils/types";

interface IStore {
  account?: UserAccount;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({});

  return [
    store,
    {
      fetchCurrentUser: async () => {
        let result = await invoke("fetch_current_user");
        setStore({ ...store, account: result as UserAccount });
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const userStore = makeStore();

const UserContext = createContext<TStoreAndFunctions>(userStore);

export const UserProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <UserContext.Provider value={userStore}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
