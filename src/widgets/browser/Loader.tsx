import { Component, createComputed } from "solid-js";
import { useQueryResult } from "../../stores/queryResult";

const Loader: Component = () => {
  const [queryResult, { fetchResults }] = useQueryResult();

  createComputed(async () => {
    if (!!queryResult.query && queryResult.query.length >= 1) {
      // We invoke the Tauri API to get the data
      fetchResults();
    }
  });

  return <></>;
};

export default Loader;
