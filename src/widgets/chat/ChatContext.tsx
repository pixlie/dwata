import { Component, For, createMemo, createSignal, onMount } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { APIChatContextNode } from "../../api_types/APIChatContextNode";
import { invoke } from "@tauri-apps/api/core";
import Dropdown, { IChoicesWithHeading } from "../interactable/Dropdown";
import { APIChatContextType } from "../../api_types/APIChatContextType";
import TextArea from "../interactable/TextArea";

interface IPropTypes {
  chatContextId: string;
}

interface IChatContext {
  context?: string;
  nodes: Array<Array<APIChatContextNode>>;
}

interface IFormState {
  nodePath: Array<string>;
}

const ChatContext: Component<IPropTypes> = () => {
  const [chatContext, setChatContext] = createSignal<IChatContext>({
    nodes: [],
  });
  const [formState, setFormState] = createSignal<IFormState>({
    nodePath: [],
  });
  const [_, { getColors }] = useUserInterface();

  onMount(async () => {
    const response = await invoke<Array<APIChatContextNode>>(
      "fetch_chat_context_node_list",
      {
        nodePath: formState().nodePath,
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

  const handleDropdownSelect = (index: number) => async (newValue: string) => {
    setFormState({
      ...formState(),
      nodePath: [
        ...formState().nodePath.slice(0, index),
        newValue,
        ...formState().nodePath.slice(index + 1),
      ],
    });
    const response = await invoke<Array<APIChatContextNode>>(
      "fetch_chat_context_node_list",
      {
        nodePath: formState().nodePath,
      }
    );
    const nodeObject = chatContext().nodes[index].find(
      (x) => x.id === newValue
    );
    if (response.length) {
      setChatContext({
        ...chatContext(),
        nodes: [...chatContext().nodes, response],
      });
    }
    if (nodeObject?.canCreateContext) {
      const response = await invoke("fetch_chat_context", {
        nodePath: formState().nodePath,
      });
      setChatContext({
        ...chatContext(),
        context: response as string,
      });
    }
  };

  return (
    <div
      class="w-full rounded-md my-2 border"
      style={{
        color: getColors().colors["editor.foreground"],
        "border-color": getColors().colors["editorWidget.border"],
      }}
    >
      <div class="px-4 py-2 min-h-8">
        {chatContext().context ? (
          <>
            <TextArea value={chatContext().context} />
            <p class="pt-2">
              This will be sent along with your own message to the AI
            </p>
          </>
        ) : (
          <p>
            Chat contexts are like messages but are automatically created from
            the source you select
          </p>
        )}
      </div>

      <div
        class="p-2 px-4 rounded-md rounded-t-none border-t flex"
        style={{
          color: getColors().colors["editor.foreground"],
          "background-color": getColors().colors["editorWidget.background"],
          "border-color": getColors().colors["editorWidget.border"],
        }}
      >
        <For each={getDropdownList()}>
          {(dropdown, index) => (
            <Dropdown
              label="Select"
              choicesWithHeadings={dropdown}
              size="sm"
              isRequired
              value={formState().nodePath[index()]}
              onSelect={handleDropdownSelect(index())}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default ChatContext;
