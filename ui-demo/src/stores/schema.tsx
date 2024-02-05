import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import {
  IColumn,
  TColumnName,
  TColumnPath,
  TDataSourceName,
  TTableName,
} from "../utils/types";
import { invoke } from "@tauri-apps/api/core";

interface IStore {
  sources: Array<TDataSourceName>;
  tables: { [sourceName: TDataSourceName]: Array<TTableName> };
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
      loadSchema: () => {
        // We use the Tauri API to load schema
        invoke("load_schema").then((result) => {
          setStore(result as IStore);
        });
      },
      geTColumnPath: (
        sourceName: TDataSourceName,
        tableName: TTableName,
        columnName: TColumnName
      ): IColumn | undefined => {
        return sourceName in store.columns &&
          tableName in store.columns[sourceName]
          ? store.columns[sourceName][tableName].find(
              (col) => col.name === columnName
            )
          : undefined;
      },
      getSpecListForColumnList: (
        columns: Array<TColumnPath>
      ): Array<IColumn | undefined> => {
        return columns.map((col) =>
          col[2] in store.columns && col[1] in store.columns[col[2]]
            ? store.columns[col[2]][col[1]].find((x) => x.name === col[0])
            : undefined
        );
      },
      getAllColumnNameListForTableSource: (
        tableName: TTableName,
        sourceName: TDataSourceName
      ): Array<TColumnName> => {
        return sourceName in store.columns &&
          tableName in store.columns[sourceName]
          ? store.columns[sourceName][tableName].map((x) => x.name)
          : [];
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

export const SchemaProvider: Component<IProviderPropTypes> = (props) => {
  return (
    <SchemaContext.Provider value={schemaStore}>
      {props.children}
    </SchemaContext.Provider>
  );
};

export const useSchema = () => useContext(SchemaContext);
