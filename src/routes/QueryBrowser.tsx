import { Component } from "solid-js";
import Grid from "../widgets/grid/Grid";
import Loader from "../widgets/browser/Loader";
import { QueryResultProvider } from "../stores/queryResult";
import TableBrowser from "../widgets/browser/TableBrowser";
import Preamble from "../widgets/browser/Preamble";

const QueryBrowser: Component = () => {
  return (
    <QueryResultProvider>
      <Loader />

      <div class="flex flex-col w-full overflow-hidden">
        <Preamble />
        <TableBrowser />
        <Grid />
      </div>
    </QueryResultProvider>
  );
};

export default QueryBrowser;
