import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes, uiThemes } from "../utils/types";
import getGitHubDarkColors from "../utils/colors/gitHubDark";
import getDefaultLightModernColors from "../utils/colors/defaultLightModern";

interface IStore {
  currentTheme: uiThemes;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    currentTheme: "defaultLightModern",
  });

  return [
    store,
    {
      setTheme: (theme: uiThemes) => {
        setStore("currentTheme", theme);
      },
      getColors() {
        if (store.currentTheme === "defaultLightModern") {
          return getDefaultLightModernColors();
        }
        return getGitHubDarkColors();
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const userInterfaceStore = makeStore();

const UserInterfaceContext =
  createContext<TStoreAndFunctions>(userInterfaceStore);

export const UserInterfaceProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <UserInterfaceContext.Provider value={userInterfaceStore}>
      {props.children}
    </UserInterfaceContext.Provider>
  );
};

export const useUserInterface = () => useContext(UserInterfaceContext);
