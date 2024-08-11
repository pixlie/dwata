import { Component, For } from "solid-js";
import NavigationLink from "./NavigationLink";
import { useUserInterface } from "../../stores/userInterface";
import { searchRoutes } from "../../routes/routeList";

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
      <For each={searchRoutes}>{(item) => <NavigationLink {...item} />}</For>

      {/* <SidebarHeading label="Chats" icon="fa-solid fa-comments" href="/chat" /> */}
      {/* <div class="my-4 px-4">
        <Button label="Start a new chat" href="/chat/start" />
      </div> */}
      {/* <SidebarHeading
        label="Search"
        icon="fa-solid fa-magnifying-glass"
        href="/search"
      /> */}

      <div class="flex-grow" />
      {/* <div
        class="mt-4 border-b"
        style={{ "border-color": getColors().colors["sideBar.border"] }}
      /> */}
      <NavigationLink
        label="Settings"
        icon="fa-solid fa-cog"
        href="/settings"
      />
    </div>
  );
};

export default Sidebar;
