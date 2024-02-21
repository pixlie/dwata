import { Component } from "solid-js";

import SidebarHeading from "./SidebarHeading";
import SourceList from "../source/SourceList";

const Sidebar: Component = () => {
  return (
    <div class="flex h-full flex-col">
      <div class="grow">
        <SidebarHeading label="Home" icon="fa-solid fa-home" href="/" />
        {/* <SidebarHeading
        label="Notes"
        icon="fa-solid fa-sticky-note"
        href="/notes"
      /> */}
        <SidebarHeading
          label="Reports"
          icon="fa-solid fa-chart-bar"
          href="/reports"
        />
        <SidebarHeading
          label="Saved Queries"
          icon="fa-solid fa-bookmark"
          href="/saved"
        />
        <div class="mt-4 border-b border-gray-800" />
        <SourceList />
        <SidebarHeading
          label="Settings"
          icon="fa-solid fa-cog"
          href="/settings"
        />
      </div>

      <div class="mt-2 px-3">
        <span class="cursor-default select-none font-bold text-white">
          Ask a co-worker or AI
        </span>
        <textarea class="mt-2 h-24 w-full grow-0 rounded-md border border-gray-500 bg-zinc-800 p-3 text-gray-50"></textarea>
      </div>
    </div>
  );
};

export default Sidebar;
