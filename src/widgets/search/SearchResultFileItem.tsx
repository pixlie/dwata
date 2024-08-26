import { Component } from "solid-js";
import { Email } from "../../api_types/Email";
import { useUserInterface } from "../../stores/userInterface";

const SearchResultFileItem: Component<Email> = (props) => {
  const [_, { getColors }] = useUserInterface();
  return (
    <div
      class="border rounded-lg my-2 h-48 flex flex-col"
      style={{
        color: getColors().colors["editor.foreground"],
      }}
    >
      <div class="grow p-4">{props.subject}</div>
      <div
        class="mt-1 border-t font-thin text-sm px-4 py-1 flex gap-4"
        style={{
          "border-color": getColors().colors["editorWidget.border"],
        }}
      >
        <span class="grow" />
        <span class="py-0.5">Date: 6 Aug 2024</span>
      </div>
    </div>
  );
};

export default SearchResultFileItem;
