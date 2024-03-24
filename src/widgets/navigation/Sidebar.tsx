import { Component } from "solid-js";

import SidebarHeading from "./SidebarHeading";
import SourceList from "../source/SourceList";

const Sidebar: Component = () => {
  return (
    <>
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
      <div class="mt-4 border-b border-gray-800" />
      <SourceList />
      <SidebarHeading
        label="Settings"
        icon="fa-solid fa-cog"
        href="/settings"
      />
    </>
  );
};

export default Sidebar;
