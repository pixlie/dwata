import { Component } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";

import NavigationBar from "./widgets/navigation/NavigationBar";
import { UserProvider } from "./stores/user";
import SourceList from "./widgets/source/SourceList";
import LabelList from "./widgets/label/LabelList";
import SidebarHeading from "./widgets/navigation/SidebarHeading";

const App: Component<RouteSectionProps> = (props) => {
  return (
    <>
      <UserProvider>
        <NavigationBar />

        <div class="flex flex-row bg-gray-300">
          <div class="h-screen w-80 bg-gray-900 pt-12">
            <SidebarHeading label="Notes" icon="fa-solid fa-sticky-note" />
            <SidebarHeading label="Reports" icon="fa-solid fa-chart-bar" />
            <SidebarHeading label="Saved Queries" icon="fa-solid fa-bookmark" />
            <div class="mt-4 border-b border-gray-800" />
            <SourceList />
            <LabelList />
            <SidebarHeading label="Settings" icon="fa-solid fa-cog" />
          </div>
          <div class="grow pt-12">{props.children}</div>
        </div>
      </UserProvider>
    </>
  );
};

export default App;
