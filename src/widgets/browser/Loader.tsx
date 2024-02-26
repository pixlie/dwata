import { Component, createComputed } from "solid-js";
// import { invoke } from "@tauri-apps/api/core";
import { useQueryResult } from "../../stores/queryResult";

const Loader: Component = () => {
  const [queryResult, { fetchResults }] = useQueryResult();

  createComputed(async () => {
    // The URL parameter is a list of tables
    if (!!queryResult.query && queryResult.query.length >= 1) {
      // We invoke the Tauri API to get the data
      fetchResults();
      // console.log(
      //   await invoke("greet", {
      //     names: [{ name: "su" }, { name: "mi" }, { name: "t" }],
      //   })
      // );
    }
  });

  return <></>;
};

export default Loader;
