import { Component, createComputed } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { useQueryResult } from "../../stores/queryResult";
import { TColumnName, TDataSourceId, TTableName } from "../../utils/types";
import { useParams } from "@solidjs/router";
import { useSchema } from "../../stores/schema";

const Loader: Component = () => {
  const [queryResult, { setQuery, setQueryResult }] = useQueryResult();
  const [_, { getAllColumnNameListForTableSource }] = useSchema();
  const params = useParams();

  createComputed(async () => {
    const sourceTables = params.sourceTables;
    const selectString = "select[";
    if (sourceTables.startsWith(selectString) && sourceTables.endsWith("]")) {
      // The URL parameter is a list of tables
      setQuery({
        select: sourceTables
          .slice(selectString.length, -1)
          .split(",")
          .flatMap((sourceTableName) => {
            const [sourceName, tableName] = sourceTableName.split(".");
            return getAllColumnNameListForTableSource(
              tableName,
              sourceName
            )?.map(
              (columnName) =>
                [columnName, tableName, sourceName] as [
                  TColumnName,
                  TTableName,
                  TDataSourceId,
                ]
            );
          })
          .filter((x) => x !== undefined),
      });

      if (!!queryResult.query) {
        // We invoke the Tauri API to get the data
        const response = await invoke("load_data", {
          select: queryResult.query.select,
        });
        setQueryResult(response as IResult);
      }
    }
  });

  return <></>;
};

export default Loader;
