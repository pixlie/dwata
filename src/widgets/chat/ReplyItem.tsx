import { Component, onMount } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { Chat } from "../../api_types/Chat";
import { marked } from "marked";

interface IPropTypes extends Chat {
  showModel?: boolean;
}

const ReplyItem: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();
  let refMarkedContent: HTMLDivElement | undefined;

  onMount(() => {
    if (!!props.message && !!refMarkedContent) {
      refMarkedContent.innerHTML = marked.parse(props.message);
    }
  });

  return (
    <div
      class="p-3 rounded-md border overflow-x-scroll mb-4"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
      }}
    >
      <div style={{ color: getColors().colors["editor.foreground"] }}>
        <div
          class="whitespace-pre-wrap font-normal"
          style={{
            "font-family": `"Noto Sans", sans-serif`,
            "font-optical-sizing": "auto",
          }}
          ref={refMarkedContent}
        >
          {props.message}
        </div>

        {props.showModel ? (
          <div class="flex">
            <div class="grow" />
            <div
              class="text-sm mt-2 px-1 rounded font-thin"
              style={{
                "background-color": getColors().colors["editor.foreground"],
                color: getColors().colors["editor.background"],
              }}
            >
              Model: {props.requestedAiModel}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReplyItem;
