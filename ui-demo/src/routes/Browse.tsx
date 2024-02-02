import { useParams } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import {
  IQuery,
  TColumnName,
  TDataSourceName,
  TTableName,
} from "../utils/types";
import Grid from "../widgets/grid/Grid";
import { QueryProvider } from "../stores/query";
import Loader from "../widgets/browse/Loader";
import { QueryResultProvider } from "../stores/queryResult";

const Browse: Component = () => {
  const [query, setQuery] = createSignal<IQuery>({
    source: "__default__",
    select: [],
  });
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
  }
  console.log(query());

  return (
    <QueryProvider initial={query()}>
      <QueryResultProvider
        initial={{
          isFetching: true,
          data: { columns: [], rows: [] },
          errors: [],
        }}
      >
        <Loader />
        <Grid />
      </QueryResultProvider>
    </QueryProvider>
  );
};

export default Browse;
