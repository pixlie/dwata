import { Component, For, createMemo } from "solid-js";
import { useWorkspace } from "../../stores/workspace";
import { useUserInterface } from "../../stores/userInterface";
import { useNavigate } from "@solidjs/router";
import { Module } from "../../api_types/Module";
import { OAuth2App } from "../../api_types/OAuth2App";

const SettingsOAuth2AppItem: Component<OAuth2App> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/settings/oauth2-app/edit/${props.id}`);
  };

  return (
    <div
      class="px-4 py-2 rounded-md border cursor-pointer capitalize"
      style={{
        "background-color": getColors().colors["panel.background"],
        "border-color": getColors().colors["panel.border"],
        color: getColors().colors["editor.foreground"],
      }}
      onClick={handleClick}
    >
      <i class="fa-solid fa-key w-6 text-gray-500" />
      {props.provider}
      <div>
        <span class="bg-gray-500 text-gray-100 rounded-sm px-2">
          {props.provider}
        </span>
      </div>
    </div>
  );
};

const SettingsOAuth2AppList: Component = () => {
  const [workspace] = useWorkspace();
  const module: Module = "OAuth2App";

  const getItems = createMemo(() => {
    if (!workspace.isFetching[module] && !!workspace.isReady[module]) {
      return workspace[module];
    }
    return [];
  });

  return (
    <div class="flex gap-x-4">
      <For each={getItems()}>
        {(item) => <SettingsOAuth2AppItem {...item} />}
      </For>
    </div>
  );
};

export default SettingsOAuth2AppList;
