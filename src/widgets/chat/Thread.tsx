import { Component, For } from "solid-js";
import Heading from "../typography/Heading";
import { APIChatThread } from "../../api_types/APIChatThread";
import { useNavigate } from "@solidjs/router";
import { useUserInterface } from "../../stores/userInterface";

const Thread: Component<APIChatThread> = (props) => {
  const navigate = useNavigate();
  const [_, { getColors }] = useUserInterface();

  const handleClick = () => {
    navigate(`/chat/${props.id}`);
  };

  return (
    <div
      class="my-3 p-3 rounded-md cursor-pointer border"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
      }}
      onClick={handleClick}
    >
      <Heading size="base">{props.title}</Heading>
      <div class="flex flex-row">
        <div class="grow" />
        <div>
          <span class="inline-block text-xs bg-gray-500 text-gray-900 rounded-sm px-2 mr-1 cursor-default">
            {props.aiProvider} / {props.aiModel}
          </span>
        </div>
      </div>
      <p class="text-zinc-400 text-sm">{props.summary}</p>
      {!!props.labels && props.labels.length && (
        <div class="mt-2">
          <For each={props.labels}>
            {(label) => (
              <span class="inline-block text-xs bg-gray-500 text-gray-900 rounded-sm px-2 mr-3 cursor-default">
                {label}
              </span>
            )}
          </For>
        </div>
      )}
    </div>
  );
};

export default Thread;
