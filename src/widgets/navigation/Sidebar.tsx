import { Component } from "solid-js";
import SidebarHeading from "./SidebarHeading";
// import SourceList from "../source/SourceList";
import { useUserInterface } from "../../stores/userInterface";
import Button from "../interactable/Button";

const Sidebar: Component = () => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div
      class="w-64 shrink-0 border-r-2 flex flex-col"
      style={{
        "background-color": getColors().colors["sideBar.background"],
        "border-color": getColors().colors["sideBar.border"],
      }}
    >
      <SidebarHeading label="Home" icon="fa-solid fa-home" href="/" />
      {/* <SidebarHeading
        label="Notes"
        icon="fa-solid fa-sticky-note"
        href="/notes"
      /> */}
      <SidebarHeading label="Chats" icon="fa-solid fa-comments" href="/chat" />
      <div class="my-4 px-4">
        <Button label="Start a new chat" href="/chat/start" />
      </div>

      <SidebarHeading
        label="Search"
        icon="fa-solid fa-magnifying-glass"
        href="/search"
      />

      <div
        class="mt-4 border-b"
        style={{ "border-color": getColors().colors["sideBar.border"] }}
      />
      {/* <SourceList /> */}
      <div class="flex-grow" />
      {/* <div
        class="mt-4 border-b"
        style={{ "border-color": getColors().colors["sideBar.border"] }}
      /> */}
      <SidebarHeading
        label="Settings"
        icon="fa-solid fa-cog"
        href="/settings"
      />
    </div>
  );
};

export default Sidebar;
