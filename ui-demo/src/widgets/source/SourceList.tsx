import { Component, For, createMemo, onMount } from "solid-js";

// import SidebarItem from "../navigation/SidebarItem";
import SidebarHeading from "../navigation/SidebarHeading";
import { useWorkspace } from "../../stores/workspace";
import { SchemaProvider, useSchema } from "../../stores/schema";
import SchemaLoader from "../SchemaLoader";
import SidebarItem from "../navigation/SidebarItem";

const TableList: Component = () => {
  const [schema] = useSchema();

  const tables = createMemo(() => {
    if (!schema.isFetching && !!schema.isReady) {
      return schema.tables;
    }
  });

  return (
    <>
      <For each={tables()}>{(table) => <SidebarItem name={table.name} />}</For>
    </>
  );
};

const SourceList: Component = () => {
  const [workspace, { readConfigFromAPI }] = useWorkspace();

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
              <SidebarHeading label={label} icon="fa-solid fa-database" />
              <SchemaProvider>
                <SchemaLoader dataSourceId={dataSource.id} />

                <TableList />
              </SchemaProvider>
            </>
          );
        }}
      </For>
      <div class="mt-4 border-b border-gray-800" />
    </>
  );
};

export default SourceList;
