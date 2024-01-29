import { Component, For, onMount } from "solid-js";

import { useDataSource } from "../../stores/dataSource";
import SourceItem from "./SourceItem";

const SourceList: Component = () => {
  const [dsStore, { loadDataSources }] = useDataSource();

  onMount(() => {
    loadDataSources();
  });

  return (
    <div class="flex flex-col">
      <div class="mt-4 block px-3 font-bold text-gray-500">Data sources</div>

      <For each={dsStore.sources}>
        {(dataSource) => <SourceItem label={dataSource.label} />}
      </For>
    </div>
  );
};

export default SourceList;
