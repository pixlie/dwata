import { Component, createComputed } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { useQueryResult } from "../../stores/queryResult";
import { APIGridData } from "../../api_types/APIGridData";

const Loader: Component = () => {
  const [queryResult, { setQueryResult }] = useQueryResult();

  createComputed(async () => {
    // The URL parameter is a list of tables
    if (!!queryResult.query && queryResult.query.length >= 1) {
      // We invoke the Tauri API to get the data
      const response = await invoke("load_data", {
        select: [...queryResult.query],
      });
      setQueryResult(response as Array<APIGridData>);
    }
  });

  return <></>;
};

export default Loader;
