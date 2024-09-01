import { Component } from "solid-js";
import { Email } from "../../api_types/Email";
import { useUserInterface } from "../../stores/userInterface";
import { SecondsToRelativeDateTime } from "../display/DateTime";

const SearchResultEmailItem: Component<Email> = (props) => {
  const [_, { getColors }] = useUserInterface();

  let fromAddress = props.fromEmailAddress;
  // We remove the actual email address from the format "Name <email>"
  fromAddress = fromAddress?.replace(/<(.*?)>/, "");

  return (
    <div
      class="border-b py-3 px-4"
      style={{
        "border-color": getColors().colors["sideBar.border"],
        color: getColors().colors["editor.foreground"],
      }}
    >
      <div class="flex py-1">
        <div class="grow font-normal">{fromAddress}</div>
        <div class="font-normal">
          <SecondsToRelativeDateTime seconds={props.date} />
        </div>
      </div>

      <div class="text-xl font-semibold line-clamp-1">{props.subject}</div>

      <div class="font-thin line-clamp-3">{props.bodyText}</div>
    </div>
  );
};

export default SearchResultEmailItem;
