import { Component, For, createMemo, onMount } from "solid-js";

// import SidebarItem from "../navigation/SidebarItem";
import SidebarHeading from "../navigation/SidebarHeading";
import { useWorkspace } from "../../stores/workspace";

const SourceList: Component = () => {
  const [workspace, { readConfigFromAPI }] = useWorkspace();

  onMount(async () => {
    await readConfigFromAPI();
  });

  const dataSources = createMemo(() => {
    if (!workspace.isFetching && workspace.isReady) {
      console.log(
        workspace.isFetching,
        workspace.isReady,
        workspace.dataSourceList
      );
      return workspace.dataSourceList;
    }
    return undefined;
  });

  return (
    <>
      <For each={dataSources()}>
        {(item) => {
          const name = Object.values(item.source)[0].name;
          const label = item.label || name;

          return <SidebarHeading label={label} icon="fa-solid fa-database" />;
        }}
      </For>
      <div class="mt-4 border-b border-gray-800" />
    </>
  );
};

export default SourceList;
