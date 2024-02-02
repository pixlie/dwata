import { Component, createComputed } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { useQueryResult } from "../../stores/queryResult";
import {
  IQueryResult,
  TColumnName,
  TDataSourceName,
  TTableName,
} from "../../utils/types";
import { useParams } from "@solidjs/router";

const Loader: Component = () => {
  const [queryResult] = useQueryResult();
  const [_, { setQuery, setQueryResult }] = useQueryResult();
  const params = useParams();

  createComputed(() => {
    console.log("params", params);
    const tables = params.tables;
    const selectString = "select[";
    if (tables.startsWith(selectString) && tables.endsWith("]")) {
      // The URL parameter is a list of tables
      setQuery({
        source: "__default__",
        select: tables
          .slice(selectString.length, -1)
          .split(",")
          .map(
            (s) =>
              ["*", s, "__default__"] as [
                TColumnName,
                TTableName,
                TDataSourceName,
              ]
          ),
      });

      if (!!queryResult.query) {
        console.log("invoking", queryResult.query.select);
        // We invoke the Tauri API to get the data
        invoke("load_data", { select: queryResult.query.select }).then(
          (result) => {
            setQueryResult(result as IQueryResult);
            console.log("result", result);
          }
        );
      }
    }
  });

  return <></>;
};

export default Loader;
