import { Component, For, createMemo, onMount } from "solid-js";
import { useWorkspace } from "../../stores/workspace";
import { useUserInterface } from "../../stores/userInterface";
import { useNavigate } from "@solidjs/router";
import { DirectorySource } from "../../api_types/DirectorySource";
import { DatabaseSource } from "../../api_types/DatabaseSource";

const DatabaseSourceItem: Component<DatabaseSource> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/settings/database-source/edit/${props.id}`);
  };

  return (
    <div
      class="p-4 text-white rounded-md border cursor-pointer"
      style={{
        "background-color": getColors().colors["panel.background"],
        "border-color": getColors().colors["panel.border"],
      }}
      onClick={handleClick}
    >
      <i class="fa-solid fa-database w-6 text-gray-500" />
      {props.label || props.databaseName}
      <div>
        <span class="text-xs bg-gray-500 text-gray-900 rounded-sm px-2">
          Database
        </span>
      </div>
    </div>
  );
};

const DirectorySourceItem: Component<DirectorySource> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/settings/directory-source/edit/${props.id}`);
  };

  return (
    <div
      class="p-4 text-white rounded-md border cursor-pointer"
      style={{
        "background-color": getColors().colors["panel.background"],
        "border-color": getColors().colors["panel.border"],
      }}
      onClick={handleClick}
    >
      <i class="fa-solid fa-folder w-6 text-gray-500" />
      {props.label || props.path}
      <div>
        <span class="text-xs bg-gray-500 text-gray-900 rounded-sm px-2">
          Markdown files
        </span>
      </div>
    </div>
  );
};

const SettingsSourceList: Component = () => {
  const [workspace, { readDirectoryList, readDatabaseList }] = useWorkspace();

  onMount(async () => {
    await readDirectoryList();
    await readDatabaseList();
  });

  const databaseSources = createMemo(() => {
    if (!workspace.isFetching && !!workspace.isReady) {
      return workspace.databaseList;
    }
    return [];
  });

  const directorySources = createMemo(() => {
    if (
      !workspace.isFetching &&
      !!workspace.isReady &&
      !!workspace.directoryList
    ) {
      return workspace.directoryList;
    }
    return [];
  });

  return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <For each={directorySources()}>
          {(directory) => <DirectorySourceItem {...directory} />}
        </For>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <For each={databaseSources()}>
          {(dataSource) => <DatabaseSourceItem {...dataSource} />}
        </For>
      </div>
    </>
  );
};

export default SettingsSourceList;
