import { Component, JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { invoke } from "@tauri-apps/api/core";
import { Schema } from "../api_types/Schema";
import { Column } from "../api_types/Column";
import { ColumnPath } from "../api_types/ColumnPath";

interface IStore {
  schemaForAllSources: { [dataSourceId: string]: Schema };

  lastFetchedAt?: Date;
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
        const WAIT_SECONDS = 10000;
        const timePassed = !!store.lastFetchedAt
          ? new Date() - store.lastFetchedAt
          : WAIT_SECONDS;
        if (!!dataSourceId && timePassed >= WAIT_SECONDS) {
          setStore("isFetching", true);
          const result = await invoke("read_schema", { dataSourceId });
          setStore("schemaForAllSources", dataSourceId, result as Schema);
          setStore((state) => ({
            ...state,
            lastFetchedAt: new Date(),
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
        columns: Array<ColumnPath>
      ): Array<Column | undefined> => {
        // TODO: Improve the function to return Array<IColumn> only
        return columns.map((columnPath) =>
          columnPath.dsi in store.schemaForAllSources &&
          store.schemaForAllSources[columnPath.dsi].tables.findIndex(
            (x) => x.name === columnPath.tn
          ) !== -1
            ? store.schemaForAllSources[columnPath.dsi].tables
                .find((x) => x.name === columnPath.tn)
                ?.columns.find((cn) => cn.name === columnPath.cn)
            : undefined
        );
      },
      getAllColumnNameListForTableSource: (
        tableName: string,
        dataSouceId: string
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
