import { Component } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";
import NavigationBar from "./widgets/navigation/NavigationBar";
import { UserProvider } from "./stores/user";
import Sidebar from "./widgets/navigation/Sidebar";
import { WorkspaceProvider } from "./stores/workspace";
import { SchemaProvider } from "./stores/schema";

const App: Component<RouteSectionProps> = (props) => {
  return (
    <div class="w-dvw h-dvh">
      <UserProvider>
        <WorkspaceProvider>
          <SchemaProvider>
            <NavigationBar />

            <div class="flex flex-row bg-gray-300 w-dvw h-dvh">
              <div class="w-64 flex-none border-r-2 border-gray-800 bg-gray-900 pt-16">
                <Sidebar />
              </div>

              <div class="grow bg-zinc-900 p-4 pt-16">{props.children}</div>
            </div>
          </SchemaProvider>
        </WorkspaceProvider>
      </UserProvider>
    </div>
  );
};

export default App;
