import { Component, onMount } from "solid-js";
import { useSchema } from "../stores/schema";

const SchemaLoader: Component = () => {
  const [_, { loadSchema }] = useSchema();

  onMount(() => {
    loadSchema();
  });

  return <></>;
};

export default SchemaLoader;
