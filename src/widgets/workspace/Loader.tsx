import { Component, onMount } from "solid-js";
import { useWorkspace } from "../../stores/workspace";

const WorkspaceLoader: Component = () => {
  const [_, { readConfigFromAPI }] = useWorkspace();

  onMount(async () => {
    await readConfigFromAPI();
  });

  return null;
};

export default WorkspaceLoader;
