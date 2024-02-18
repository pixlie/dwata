import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import {
  // TColumnName,
  TColumnPath,
  TDataSourceId,
  TTableName,
} from "../utils/types";
import { invoke } from "@tauri-apps/api/core";
// import { Column } from "../api_types/Column";
import { Schema } from "../api_types/Schema";
import { Column } from "../api_types/Column";

interface IStore {
  schemaForAllSources: { [source: TDataSourceId]: Schema };
  isFetching: boolean;
  isReady: boolean;
}

const makeStore = () => {
  const [store, setStore] = createStore<IStore>({
    isFetching: false,
    isReady: false,
    schemaForAllSources: {},
  });

  return [
    store,
    {
      readSchemaFromAPI: async (dataSourceId: string) => {
        // We use the Tauri API to load schema
        if (!!dataSourceId) {
          setStore("isFetching", true);
          const result = await invoke("read_schema", { dataSourceId });
          setStore("schemaForAllSources", dataSourceId, result as Schema);
          setStore((state) => ({
            ...state,
            isFetching: false,
            isReady: true,
          }));
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
      getColumnListForColumnPathList: (
        columns: Array<TColumnPath>
      ): Array<Column | undefined> => {
        // TODO: Improve the function to return Array<IColumn> only
        return columns.map((col) =>
          col[2] in store.schemaForAllSources &&
          col[1] in store.schemaForAllSources[col[2]].tables.keys()
            ? store.schemaForAllSources[col[2]].tables
                .find((tn) => tn.name === col[1])
                ?.columns.find((cn) => cn.name === col[0])
            : undefined
        );
      },
      getAllColumnNameListForTableSource: (
        tableName: TTableName,
        dataSouceId: TDataSourceId
      ): Array<string> => {
        const table =
          dataSouceId in store.schemaForAllSources &&
          store.schemaForAllSources[dataSouceId].tables.find(
            (tn) => tn.name === tableName
          );
        return table ? table.columns.map((col) => col.name) : [];
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
