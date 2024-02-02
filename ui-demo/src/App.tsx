import { Component } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";
import NavigationBar from "./widgets/navigation/NavigationBar";
import { UserProvider } from "./stores/user";
// import SourceList from "./widgets/source/SourceList";
// import LabelList from "./widgets/label/LabelList";
// import SidebarHeading from "./widgets/navigation/SidebarHeading";
import Sidebar from "./widgets/navigation/Sidebar";
import ChatBar from "./widgets/navigation/ChatBar";

const App: Component<RouteSectionProps> = (props) => {
  return (
    <>
      <UserProvider>
        <NavigationBar />

        <div class="flex flex-row bg-gray-300">
          <div class="h-screen w-80 border-r-2 border-gray-800 bg-gray-900 pt-16">
            <Sidebar />
          </div>

          <div class="h-screen grow bg-zinc-900 p-4 pt-16">
            {props.children}
          </div>

          <div class="h-screen w-80 border-l-2 border-gray-800 bg-zinc-900 pt-16">
            <ChatBar />
          </div>
        </div>
      </UserProvider>
    </>
  );
};

export default App;
