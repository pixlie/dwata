import { Component, createComputed } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { useQueryResult } from "../../stores/queryResult";
import {
  IResult,
  TColumnName,
  TDataSourceName,
  TTableName,
} from "../../utils/types";
import { useParams } from "@solidjs/router";
import { useSchema } from "../../stores/schema";

const Loader: Component = () => {
  const [queryResult, { setQuery, setQueryResult }] = useQueryResult();
  const [_, { getAllColumnNameListForTableSource }] = useSchema();
  const params = useParams();
  const sourceName = "__default__";

  createComputed(() => {
    const tables = params.tables;
    const selectString = "select[";
    if (tables.startsWith(selectString) && tables.endsWith("]")) {
      // The URL parameter is a list of tables
      setQuery({
        source: "__default__",
        select: tables
          .slice(selectString.length, -1)
          .split(",")
          .flatMap((tableName) => {
            return getAllColumnNameListForTableSource(
              tableName,
              sourceName
            )?.map(
              (columnName) =>
                [columnName, tableName, sourceName] as [
                  TColumnName,
                  TTableName,
                  TDataSourceName,
                ]
            );
          })
          .filter((x) => x !== undefined),
      });

      if (!!queryResult.query) {
        // We invoke the Tauri API to get the data
        invoke("load_data", { select: queryResult.query.select }).then(
          (result) => {
            setQueryResult(result as IResult);
          }
        );
      }
    }
  });

  return <></>;
};

export default Loader;
