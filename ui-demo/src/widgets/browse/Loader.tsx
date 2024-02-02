import { Component } from "solid-js";
import { useQuery } from "../../stores/query";
import { invoke } from "@tauri-apps/api/core";
import { useQueryResult } from "../../stores/queryResult";
import { IQueryResult } from "../../utils/types";

const Loader: Component = () => {
  const [query] = useQuery();
  const [_, { setQueryResult }] = useQueryResult();
  // We invoke the Tauri API to get the data
  invoke("get_data", { select: query.select }).then((result) => {
    setQueryResult(result as IQueryResult);
  });

  return <></>;
};

export default Loader;
