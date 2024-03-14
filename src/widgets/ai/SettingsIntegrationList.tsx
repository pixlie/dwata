import { Component, For, createMemo, onMount } from "solid-js";
import { useWorkspace } from "../../stores/workspace";
import { APIAPIntegration } from "../../api_types/APIAPIntegration";

const SettingsAIIntegrationItem: Component<APIAPIntegration> = (props) => {
  return (
    <div class="p-4 bg-zinc-800 text-white rounded-md">
      <i class="fa-solid fa-database w-6 text-gray-500" />
      {props.displayLabel || props.aiProvider}
      <div>
        <span class="text-xs bg-gray-500 text-gray-900 rounded-sm px-2">
          {props.aiProvider}
        </span>
      </div>
    </div>
  );
};

const SettingsAIIntegrationList: Component = () => {
  const [workspace, { readConfigFromAPI }] = useWorkspace();

  onMount(async () => {
    await readConfigFromAPI();
  });

  const dataSources = createMemo(() => {
    if (!workspace.isFetching && !!workspace.isReady) {
      return workspace.aiIntegrationList;
    }
    return undefined;
  });

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <For each={dataSources()}>
        {(dataSource) => <SettingsAIIntegrationItem {...dataSource} />}
      </For>
    </div>
  );
};

export default SettingsAIIntegrationList;