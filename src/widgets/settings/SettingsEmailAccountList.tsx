import { Component, For, createMemo } from "solid-js";
import { useWorkspace } from "../../stores/workspace";
import { useUserInterface } from "../../stores/userInterface";
import { useNavigate } from "@solidjs/router";
import { EmailAccount } from "../../api_types/EmailAccount";
import { Module } from "../../api_types/Module";

const SettingsEmailAccountItem: Component<EmailAccount> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/settings/email-account/edit/${props.id}`);
  };

  return (
    <div
      class="px-4 py-2 rounded-md border cursor-pointer font-thin"
      style={{
        "background-color": getColors().colors["panel.background"],
        "border-color": getColors().colors["panel.border"],
        color: getColors().colors["editor.foreground"],
      }}
      onClick={handleClick}
    >
      <i class="fa-solid fa-envelope w-6 text-gray-500" />
      {props.emailAddress}
      <div>
        <span class="bg-gray-500 text-gray-100 rounded-sm px-2">
          {props.provider}
        </span>
      </div>
    </div>
  );
};

const SettingsEmailAccountList: Component = () => {
  const [workspace] = useWorkspace();
  const module: Module = "EmailAccount";

  const getItems = createMemo(() => {
    if (!workspace.isFetching[module] && !!workspace.isReady[module]) {
      return workspace[module];
    }
    return [];
  });

  return (
    <div class="flex gap-x-4">
      <For each={getItems()}>
        {(item) => <SettingsEmailAccountItem {...item} />}
      </For>
    </div>
  );
};

export default SettingsEmailAccountList;
