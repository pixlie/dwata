import { invoke } from "@tauri-apps/api/core";
import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { INextTask, IProviderPropTypes } from "../utils/types";
import { ModuleDataRead } from "../api_types/ModuleDataRead";

interface IStore {
  tasks: Array<INextTask>;
  results: { [taskName: string]: any };
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    tasks: [],
    results: {},
  });

  return [
    store,
    {
      initiateTask: async (props: INextTask) => {
        let args = !!props.arguments
          ? props.arguments.reduce((acc, curr) => {
              let value = undefined;
              if ("Text" in curr[2] && !!curr[2].Text) {
                value = curr[2].Text;
              } else if ("ID" in curr[2] && !!curr[2].ID) {
                value = curr[2].ID;
              }
              return { ...acc, [curr[0]]: value };
            }, {})
          : {};

        let result: ModuleDataRead = await invoke(props.name, args);

        setStore({
          ...store,
          results: {
            ...store.results,
            [props.name]: result,
          },
        });
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const nextTaskStore = makeStore();

const NextTaskContext = createContext<TStoreAndFunctions>(nextTaskStore);

export const NextTaskProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <NextTaskContext.Provider value={nextTaskStore}>
      {props.children}
    </NextTaskContext.Provider>
  );
};

export const useNextTask = () => useContext(NextTaskContext);
