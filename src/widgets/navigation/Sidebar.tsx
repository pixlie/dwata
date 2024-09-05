import { Component, For } from "solid-js";
import SidebarLink from "./SidebarLink";
import { searchRoutes } from "../../routes/routeList";
import { useTailwindClasses } from "../../stores/TailwindClasses";

const Sidebar: Component = () => {
  const [_, { getClasses }] = useTailwindClasses();

  return (
    <div
      class={
        "fixed inset-y-0 left-0 z-50 block w-20 overflow-y-auto pb-4 pt-20 " +
        getClasses()["sideBar"]
      }
    >
      <ul role="list" class="flex flex-col items-center space-y-1">
        <For each={searchRoutes}>{(item) => <SidebarLink {...item} />}</For>
      </ul>

      {/* <SidebarHeading label="Chats" icon="fa-solid fa-comments" href="/chat" /> */}
      {/* <div class="my-4 px-4">
        <Button label="Start a new chat" href="/chat/start" />
      </div> */}
      {/* <SidebarHeading
        label="Search"
        icon="fa-solid fa-magnifying-glass"
        href="/search"
      /> */}

      <div class="grow" />
      <SidebarLink label="Settings" icon="fa-solid fa-cog" href="/settings" />
    </div>
  );
};

export default Sidebar;
