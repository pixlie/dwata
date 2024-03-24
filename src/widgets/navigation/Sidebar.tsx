import { Component } from "solid-js";
import SidebarHeading from "./SidebarHeading";
import SourceList from "../source/SourceList";
import { useUserInterface } from "../../stores/userInterface";

const Sidebar: Component = () => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div
      class="w-64 flex-none pt-16 border-r-2"
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
      {/* <SidebarHeading
        label="Saved Queries"
        icon="fa-solid fa-bookmark"
        href="/saved"
      /> */}
      <div
        class="mt-4 border-b"
        style={{ "border-color": getColors().colors["sideBar.border"] }}
      />
      <SourceList />
      <div
        class="mt-4 border-b"
        style={{ "border-color": getColors().colors["sideBar.border"] }}
      />
      <SidebarHeading
        label="Settings"
        icon="fa-solid fa-cog"
        href="/settings"
      />
    </div>
  );
};

export default Sidebar;
