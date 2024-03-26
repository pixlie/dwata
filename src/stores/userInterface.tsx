import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { uiThemes } from "../utils/types";
import getGitHubDarkColors from "../utils/colors/gitHubDark";

interface IStore {
  currentTheme: uiThemes;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    currentTheme: "gitHubDark" as uiThemes,
  });

  return [
    store,
    {
      setTheme: (theme: uiThemes) => {
        setStore("currentTheme", theme);
      },
      getColors() {
        return getGitHubDarkColors();
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const userInterfaceStore = makeStore();

const UserInterfaceContext =
  createContext<TStoreAndFunctions>(userInterfaceStore);

interface IProviderPropTypes {
  children: JSX.Element;
}

export const UserInterfaceProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <UserInterfaceContext.Provider value={userInterfaceStore}>
      {props.children}
    </UserInterfaceContext.Provider>
  );
};

export const useUserInterface = () => useContext(UserInterfaceContext);
