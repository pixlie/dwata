import { Component, For, createMemo } from "solid-js";
import SidebarHeading from "../navigation/SidebarHeading";
import { useWorkspace } from "../../stores/workspace";
import { useSearchParams } from "@solidjs/router";
import { useUserInterface } from "../../stores/userInterface";

const SourceList: Component = () => {
  const [workspace] = useWorkspace();
  const [searchParams] = useSearchParams();
  const [_, { getColors }] = useUserInterface();

  const dataSources = createMemo(() => {
    if (!workspace.isFetching && !!workspace.isReady) {
      return workspace.dataSourceList;
    }
    return [];
  });

  const folderSources = createMemo(() => {
    if (!workspace.isFetching && !!workspace.isReady) {
      return workspace.folderList;
    }
    return [];
  });

  return (
    <>
      <span
        class="mx-2 mt-2 px-2 py-1 block select-none cursor-default uppercase"
        style={{ color: getColors().colors["sideBar.foreground"] }}
      >
        Data sources
      </span>

      <For each={dataSources()}>
        {(dataSource) => {
          const label = dataSource.label || dataSource.sourceName;

          return (
            <SidebarHeading
              label={label}
              icon="fa-solid fa-database"
              href={`/browse?dataSourceId=${dataSource.id}`}
              isActive={
                !!searchParams.dataSouceId &&
                dataSource.id == searchParams.dataSouceId
              }
              infoTag={dataSource.sourceType}
            />
          );
        }}
      </For>
      <For each={folderSources()}>
        {(dataSource) => {
          const label = dataSource.label || dataSource.path;

          return (
            <SidebarHeading
              label={label}
              icon="fa-solid fa-folder"
              href={`/browse?dataSourceId=${dataSource.id}`}
              isActive={
                !!searchParams.dataSouceId &&
                dataSource.id == searchParams.dataSouceId
              }
              infoTag="Markdown files"
            />
          );
        }}
      </For>
    </>
  );
};

export default SourceList;
