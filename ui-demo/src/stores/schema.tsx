import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
// import {
//   TColumnName,
//   TColumnPath,
//   TDataSourceName,
//   TTableName,
// } from "../utils/types";
import { invoke } from "@tauri-apps/api/core";
// import { Column } from "../api_types/Column";
import { Schema } from "../api_types/Schema";

interface IStore extends Schema {
  isFetching: boolean;
  isReady: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    isFetching: false,
    isReady: false,
    tables: [],
  });

  return [
    store,
    {
      readSchemaFromAPI: async (dataSourceId: string) => {
        // We use the Tauri API to load schema
        setStore("isFetching", true);
        if (!!dataSourceId) {
          const result = await invoke("read_schema", { dataSourceId });
          setStore({
            ...(result as IStore),
            isFetching: false,
            isReady: true,
          });
        }
      },
      // getColumnPath: (
      //   sourceName: TDataSourceName,
      //   tableName: TTableName,
      //   columnName: TColumnName
      // ): Column | undefined => {
      //   return sourceName in store.columns &&
      //     tableName in store.columns[sourceName]
      //     ? store.columns[sourceName][tableName].find(
      //         (col) => col.name === columnName
      //       )
      //     : undefined;
      // },
      // getColumnListForColumnPathList: (
      //   columns: Array<TColumnPath>
      // ): Array<Column | undefined> => {
      //   // TODO: Improve the function to return Array<IColumn> only
      //   return columns.map((col) =>
      //     col[2] in store.columns && col[1] in store.columns[col[2]]
      //       ? store.columns[col[2]][col[1]].find((x) => x.name === col[0])
      //       : undefined
      //   );
      // },
      // getAllColumnNameListForTableSource: (
      //   tableName: TTableName,
      //   sourceName: TDataSourceName
      // ): Array<TColumnName> => {
      //   return sourceName in store.columns &&
      //     tableName in store.columns[sourceName]
      //     ? store.columns[sourceName][tableName].map((x) => x.name)
      //     : [];
      // },
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
