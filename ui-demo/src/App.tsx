import { Component } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";
import NavigationBar from "./widgets/navigation/NavigationBar";
import { UserProvider } from "./stores/user";
import Sidebar from "./widgets/navigation/Sidebar";
import { SchemaProvider } from "./stores/schema";
import SchemaLoader from "./widgets/SchemaLoader";
import { WorkspaceProvider } from "./stores/workspace";

const App: Component<RouteSectionProps> = (props) => {
  return (
    <>
      <UserProvider>
        <SchemaProvider>
          <WorkspaceProvider>
            <SchemaLoader />
            <NavigationBar />

            <div class="flex flex-row bg-gray-300">
              <div class="h-screen w-80 flex-none border-r-2 border-gray-800 bg-gray-900 pt-16">
                <Sidebar />
              </div>

              <div class="h-screen flex-auto bg-zinc-900 p-4 pt-16">
                {props.children}
              </div>
            </div>
          </WorkspaceProvider>
        </SchemaProvider>
      </UserProvider>
    </>
  );
};

export default App;
