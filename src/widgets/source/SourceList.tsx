import { Component, For, createMemo, onMount } from "solid-js";
import SidebarHeading from "../navigation/SidebarHeading";
import { useWorkspace } from "../../stores/workspace";
import { useSearchParams } from "@solidjs/router";

const SourceList: Component = () => {
  const [workspace, { readConfigFromAPI }] = useWorkspace();
  const [searchParams] = useSearchParams();

  onMount(async () => {
    await readConfigFromAPI();
  });

  const dataSources = createMemo(() => {
    if (!workspace.isFetching && !!workspace.isReady) {
      return workspace.dataSourceList;
    }
    return undefined;
  });

  return (
    <>
      <For each={dataSources()}>
        {(dataSource) => {
          const name = Object.values(dataSource.source)[0].name;
          const label = dataSource.label || name;

          return (
            <>
              <SidebarHeading
                label={label}
                icon="fa-solid fa-database"
                href={`/browse?dataSourceId=${dataSource.id}`}
                isActive={
                  !!searchParams.dataSouceId &&
                  dataSource.id == searchParams.dataSouceId
                }
              />
            </>
          );
        }}
      </For>
      <div class="mt-4 border-b border-gray-800" />
    </>
  );
};

export default SourceList;
