import { Component, For, createMemo } from "solid-js";
import { useWorkspace } from "../../stores/workspace";
import { useUserInterface } from "../../stores/userInterface";
import { useNavigate } from "@solidjs/router";
import { EmailAccount } from "../../api_types/EmailAccount";

const SettingsEmailAccountItem: Component<EmailAccount> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/settings/ai-integration/edit/${props.id}`);
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
      {props.emailAddress}
      <div>
        <span class="text-xs bg-gray-500 text-gray-900 rounded-sm px-2">
          {props.provider}
        </span>
      </div>
    </div>
  );
};

const SettingsEmailAccountList: Component = () => {
  const [workspace] = useWorkspace();

  const getItems = createMemo(() => {
    if (!workspace.isFetching && !!workspace.isReady) {
      return workspace.emailAccountList;
    }
    return [];
  });

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <For each={getItems()}>
        {(item) => <SettingsEmailAccountItem {...item} />}
      </For>
    </div>
  );
};

export default SettingsEmailAccountList;
