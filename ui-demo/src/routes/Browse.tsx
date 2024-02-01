import { useParams } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import {
  IQuery,
  TColumnName,
  TDataSourceName,
  TRowValue,
  TTableName,
} from "../utils/types";
import Grid from "../widgets/grid/Grid";
import { QueryProvider } from "../stores/query";

interface IData {
  columns: Array<TColumnName>;
  rows: Array<Array<TRowValue>>;
}

const Browse: Component = () => {
  const [query, setQuery] = createSignal<IQuery>({
    source: "__default__",
    select: [],
  });
  const [data, setData] = createSignal<IData>();
  const params = useParams();
  const tables = params.tables;

  const selectString = "select[";
  if (tables.startsWith(selectString) && tables.endsWith("]")) {
    // The URL parameter is a list of tables
    setQuery({
      ...query(),
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
    // We invoke the Tauri API to get the data
    invoke("get_data", { select: query().select }).then((result) => {
      setData(result as IData);
    });
  }
  console.log(query());

  if (!data()) {
    return <div>Loading...</div>;
  }

  return (
    <QueryProvider initial={query()}>
      <Grid columns={data()!.columns} rows={data()!.rows} />
    </QueryProvider>
  );
};

export default Browse;
