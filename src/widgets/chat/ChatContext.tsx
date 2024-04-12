import { Component, For, createMemo, createSignal, onMount } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { APIChatContextNode } from "../../api_types/APIChatContextNode";
import { invoke } from "@tauri-apps/api/core";
import Dropdown, { IChoicesWithHeading } from "../interactable/Dropdown";
import { APIChatContextType } from "../../api_types/APIChatContextType";

interface IPropTypes {
  chatContextId: string;
}

interface ChatContext {
  currentContext: Array<string>;
  nodes: Array<Array<APIChatContextNode>>;
}

const ChatContext: Component<IPropTypes> = () => {
  const [chatContext, setChatContext] = createSignal<ChatContext>({
    currentContext: [],
    nodes: [],
  });
  const [_, { getColors }] = useUserInterface();

  onMount(async () => {
    const response = await invoke<Array<APIChatContextNode>>(
      "fetch_available_chat_context_list",
      {
        currentContext: chatContext().currentContext,
      }
    );
    setChatContext({
      ...chatContext(),
      nodes: [response],
    });
  });

  const getHeadingName = (head: APIChatContextType) => {
    switch (head) {
      case "DataSource":
        return "Data Source";
      case "ContentsFromFile":
        return "Contents From File";
      case "StructureOfDataSource":
        return "Structure Of Data Source";
      case "ResultFromPreviousChat":
        return "Result From Previous Chat";
    }
  };

  const getDropdownList = createMemo(() => {
    const list: Array<Array<IChoicesWithHeading>> = [];
    chatContext().nodes.forEach((level) => {
      // Group all the nodes by their contextType
      // The contextType becomes the heading
      list.push(
        level.reduce((accumulator: Array<IChoicesWithHeading>, item) => {
          if (
            accumulator.findIndex(
              (x) => x.name === getHeadingName(item.contextType)
            ) === -1
          ) {
            // Add the heading
            accumulator.push({
              name: getHeadingName(item.contextType),
              choices: [
                {
                  key: item.id,
                  label: item.contextLabel,
                },
              ],
            });
          } else {
            // Push this current node into this heading
            accumulator[
              accumulator.findIndex(
                (x) => x.name === getHeadingName(item.contextType)
              )
            ].choices.push({
              key: item.id,
              label: item.contextLabel,
            });
          }
          return accumulator;
        }, [])
      );
    });

    return list;
  });

  return (
    <div
      class="w-full rounded-md my-2 border"
      style={{
        color: getColors().colors["editor.foreground"],
        "border-color": getColors().colors["editorWidget.border"],
      }}
    >
      <label class="block text-sm font-medium leading-6 py-2 pl-4">
        Chat context
      </label>
      <div
        class="px-4 max-h-24 overflow-hidden mb-4"
        style={{
          color: getColors().colors["editor.foreground"],
        }}
      ></div>

      <div
        class="p-2 px-4 rounded-md rounded-t-none border-t"
        style={{
          color: getColors().colors["editor.foreground"],
          "background-color": getColors().colors["editorWidget.background"],
          "border-color": getColors().colors["editorWidget.border"],
        }}
      >
        <For each={getDropdownList()}>
          {(dropdown) => (
            <Dropdown label="Select" choicesWithHeadings={dropdown} size="sm" />
          )}
        </For>
      </div>
    </div>
  );
};

export default ChatContext;
