import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { IProviderPropTypes } from "../utils/types";
import lightDefault from "../utils/uIClasses/lightDefault";

interface IStore {
  currentTheme: "lightDefault";
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    currentTheme: "lightDefault",
  });

  return [
    store,
    {
      setTheme: (theme: "lightDefault") => {
        setStore("currentTheme", theme);
      },
      getClasses() {
        return lightDefault["tailwindClasses"];
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
const tailwindClassesStore = makeStore();

const tailwindClassesContext =
  createContext<TStoreAndFunctions>(tailwindClassesStore);

export const TailwindClassesProvider: Component<IProviderPropTypes> = (
  props,
) => {
  return (
    <tailwindClassesContext.Provider value={tailwindClassesStore}>
      {props.children}
    </tailwindClassesContext.Provider>
  );
};

export const useTailwindClasses = () => useContext(tailwindClassesContext);
