import { Component, createComputed } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { useQueryResult } from "../../stores/queryResult";
import { useParams } from "@solidjs/router";
import { useSchema } from "../../stores/schema";
import { DwataData } from "../../api_types/DwataData";

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
            const [dataSourceId, tableName] = sourceTableName.split(".");
            return getAllColumnNameListForTableSource(
              tableName,
              dataSourceId
            )?.map((columnName) => ({
              cn: columnName,
              tn: tableName,
              dsi: dataSourceId,
            }));
          }),
        ordering: [],
        filtering: [],
      });

      if (!!queryResult.query) {
        // We invoke the Tauri API to get the data
        const response = await invoke("load_data", {
          select: [...queryResult.query.select],
          ordering: { ...queryResult.query.ordering },
          filtering: { ...queryResult.query.filtering },
        });
        setQueryResult(response as DwataData);
        console.log(response);
      }
    }
  });

  return <></>;
};

export default Loader;
