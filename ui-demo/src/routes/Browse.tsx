import { Component } from "solid-js";
import Grid from "../widgets/grid/Grid";
import Loader from "../widgets/browse/Loader";
import { QueryResultProvider } from "../stores/queryResult";

const Browse: Component = () => {
  return (
    <QueryResultProvider>
      <Loader />
      <Grid />
    </QueryResultProvider>
  );
};

export default Browse;
