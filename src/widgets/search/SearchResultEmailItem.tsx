import { Component } from "solid-js";
import { Email } from "../../api_types/Email";
import { useUserInterface } from "../../stores/userInterface";
import { SecondsToRelativeDateTime } from "../display/DateTime";
import { useSearchParams } from "@solidjs/router";
import { useSearchableData } from "../../stores/searchableData";

const SearchResultEmailItem: Component<Email> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const [_a, setSearchParams] = useSearchParams();
  const [{}, { fetchFullEmailByPk }] = useSearchableData();

  let fromAddress = props.fromEmailAddress;
  // We remove the actual email address from the format "Name <email>"
  fromAddress = fromAddress?.replace(/<(.*?)>/, "");

  // When we click an email in the list, we set the URL search param "emailId" to the PK of the email
  const handleEmailClick = () => {
    console.log("handleEmailClick", props.id);
    fetchFullEmailByPk(props.id);
    setSearchParams({ emailId: props.id.toString() });
  };

  return (
    <div
      class="border-b py-3 px-4 cursor-pointer opacity-80 hover:opacity-100 hover:shadow-md"
      style={{
        "border-color": getColors().colors["sideBar.border"],
        color: getColors().colors["editor.foreground"],
      }}
      onClick={handleEmailClick}
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
