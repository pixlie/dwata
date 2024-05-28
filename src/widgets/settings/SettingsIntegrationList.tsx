import { Component, For, createMemo } from "solid-js";
import { useWorkspace } from "../../stores/workspace";
import { useUserInterface } from "../../stores/userInterface";
import { useNavigate } from "@solidjs/router";
import { AIIntegration } from "../../api_types/AIIntegration";

const SettingsAIIntegrationItem: Component<AIIntegration> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/settings/ai-provider/edit/${props.id}`);
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
      {props.label || props.aiProvider}
      <div>
        <span class="text-xs bg-gray-500 text-gray-900 rounded-sm px-2">
          {props.aiProvider}
        </span>
      </div>
    </div>
  );
};

const SettingsAIIntegrationList: Component = () => {
  const [workspace] = useWorkspace();

  const aiIntegrations = createMemo(() => {
    if (!workspace.isFetching && !!workspace.isReady) {
      return workspace.aiIntegrationList;
    }
    return [];
  });

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <For each={aiIntegrations()}>
        {(dataSource) => <SettingsAIIntegrationItem {...dataSource} />}
      </For>
    </div>
  );
};

export default SettingsAIIntegrationList;
