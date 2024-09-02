import { Component } from "solid-js";
import { useSearchableData } from "../../stores/searchableData";
import Heading from "../typography/Heading";
import { useUserInterface } from "../../stores/userInterface";

const SelectedEmail: Component = () => {
  const [_, { getColors }] = useUserInterface();
  const [{ selectedEmail }] = useSearchableData();

  if (selectedEmail.state !== "ready") {
    return null;
  }

  // We render a full email like in any email client
  return (
    <div class="flex flex-col">
      <Heading size={4}>{selectedEmail()?.subject}</Heading>

      <div
        class="text-xs py-2 border-t border-b"
        style={{ "border-color": getColors().colors["sideBar.border"] }}
      >
        <div
          class="border rounded-md inline-block p-1 cursor-pointer"
          style={{ "border-color": getColors().colors["sideBar.border"] }}
        >
          Actions coming soon
        </div>
      </div>

      <div class="flex flex-col gap-y-0.5 pb-16">
        {selectedEmail()
          ?.bodyText?.split("\n")
          .map((x) => <div class="font-thin text-lg">{x}</div>)}
      </div>
    </div>
  );
};

export default SelectedEmail;
