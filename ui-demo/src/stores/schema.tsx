import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import {
  IColumn,
  TColumnName,
  TDataSourceName,
  TTableName,
} from "../utils/types";

interface IStore {
  sources: Array<TDataSourceName>;
  tables: { [sourceName: TDataSourceName]: Array<string> };
  columns: {
    [sourceName: TDataSourceName]: {
      [tableName: TTableName]: Array<IColumn>;
    };
  };
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    sources: [],
    tables: {},
    columns: {},
  });

  return [
    store,
    {
      loadSchema: async () => {},
      getColumn: (
        sourceName: TDataSourceName,
        tableName: TTableName,
        columnName: TColumnName
      ): IColumn | undefined => {
        return store.columns[sourceName][tableName].find(
          (col) => col.name === columnName
        );
      },
    },
  ] as const; // `as const` forces tuple type inference
};

type TStoreAndFunctions = ReturnType<typeof makeStore>;
export const schemaStore = makeStore();

const SchemaContext = createContext<TStoreAndFunctions>(schemaStore);

interface IProviderPropTypes {
  children: JSX.Element;
}

export const UserProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <SchemaContext.Provider value={schemaStore}>
      {props.children}
    </SchemaContext.Provider>
  );
};

export const useSchema = () => useContext(SchemaContext);
