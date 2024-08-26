import { Component } from "solid-js";
import { Email } from "../../api_types/Email";
import { useUserInterface } from "../../stores/userInterface";
import SecondsToDate from "../display/secondsToDate";

const SearchResultEmailItem: Component<Email> = (props) => {
  const [_, { getColors }] = useUserInterface();
  return (
    <div
      class="border-b py-3"
      style={{
        "border-color": getColors().colors["editorWidget.border"],
        color: getColors().colors["editor.foreground"],
      }}
    >
      <div class="py-1 px-8">{props.fromEmailAddress}</div>
      <div class="text-lg font-semibold px-8">{props.subject}</div>

      <div class="font-thin px-8">{props.bodyText}</div>

      <div class="mt-1 font-thin text-sm px-4 py-1 flex gap-4">
        <span class="grow" />
        <span class="py-0.5">
          Date: <SecondsToDate seconds={props.date} />
        </span>
      </div>
    </div>
  );
};

export default SearchResultEmailItem;
