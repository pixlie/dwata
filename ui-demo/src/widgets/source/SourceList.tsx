import { Component, For, onMount } from "solid-js";

import { useDataSource } from "../../stores/dataSource";
import SidebarItem from "../navigation/SidebarItem";
import SidebarHeading from "../navigation/SidebarHeading";

const SourceList: Component = () => {
  const [dsStore, { loadDataSources }] = useDataSource();

  onMount(() => {
    loadDataSources();
  });

  return (
    <>
      <SidebarHeading label="Data Sources" icon="fa-solid fa-database" />

      <For each={dsStore.sources}>
        {(item) => <SidebarItem label={item.label} icon="fa-solid fa-table" />}
      </For>
      <div class="mt-4 border-b border-gray-800" />
    </>
  );
};

export default SourceList;
