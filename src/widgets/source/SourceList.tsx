import { Component, For, createMemo } from "solid-js";
import SidebarHeading from "../navigation/SidebarHeading";
import { useWorkspace } from "../../stores/workspace";
import { useSearchParams } from "@solidjs/router";
import { useUserInterface } from "../../stores/userInterface";

const SourceList: Component = () => {
  const [workspace] = useWorkspace();
  const [searchParams] = useSearchParams();
  const [_, { getColors }] = useUserInterface();

  const databaseSources = createMemo(() => {
    if (
      !workspace.isFetching["DatabaseSource"] &&
      !!workspace.isReady["DatabaseSource"]
    ) {
      return workspace.DatabaseSource;
    }
    return [];
  });

  const directorySources = createMemo(() => {
    if (
      !workspace.isFetching["DirectorySource"] &&
      !!workspace.isReady["DirectorySource"]
    ) {
      return workspace.DirectorySource;
    }
    return [];
  });

  const emailAccounts = createMemo(() => {
    if (
      !workspace.isFetching["EmailAccount"] &&
      !!workspace.isReady["EmailAccount"]
    ) {
      return workspace.EmailAccount;
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

      {/* <For each={databaseSources()}>
        {(dataSource) => {
          const label = dataSource.label || dataSource.databaseName;

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
      </For> */}
      {/* <For each={directorySources()}>
        {(dataSource) => {
          const label = dataSource.label || dataSource.path;

          return (
            <SidebarHeading
              label={label}
              icon="fa-solid fa-folder"
              href={`/directory/${dataSource.id}`}
              isActive={
                !!searchParams.dataSouceId &&
                dataSource.id == searchParams.dataSouceId
              }
              infoTag="Markdown files"
            />
          );
        }}
      </For> */}

      <For each={emailAccounts()}>
        {(emailAccount) => {
          const label = emailAccount.emailAddress;

          return (
            <SidebarHeading
              label={label}
              icon="fa-solid fa-envelope"
              href={`/search/?emailAccountId=${emailAccount.id}`}
              infoTag="Email account"
            />
          );
        }}
      </For>
    </>
  );
};

export default SourceList;
