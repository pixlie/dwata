import { Component, onMount } from "solid-js";
import { useWorkspace } from "../../stores/workspace";

const WorkspaceLoader: Component = () => {
  const [_, { readDirectoryList }] = useWorkspace();

  onMount(async () => {
    await readDirectoryList();
  });

  return null;
};

export default WorkspaceLoader;
