import { Component } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";
import NavigationBar from "./widgets/navigation/NavigationBar";
import { UserProvider } from "./stores/user";
import Sidebar from "./widgets/navigation/Sidebar";
import { WorkspaceProvider } from "./stores/workspace";
import { SchemaProvider } from "./stores/schema";
import {
  UserInterfaceProvider,
  useUserInterface,
} from "./stores/userInterface";

const MainContent: Component<RouteSectionProps> = (props) => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div
      class="grow p-4 pt-16"
      style={{
        "background-color": getColors().colors["editor.background"],
      }}
    >
      {props.children}
    </div>
  );
};

const App: Component<RouteSectionProps> = (props) => {
  return (
    <div class="w-dvw h-dvh">
      <UserProvider>
        <UserInterfaceProvider>
          <WorkspaceProvider>
            <SchemaProvider>
              <NavigationBar />

              <div class="flex flex-row bg-gray-300 w-dvw h-dvh">
                <Sidebar />

                <MainContent {...props} />
              </div>
            </SchemaProvider>
          </WorkspaceProvider>
        </UserInterfaceProvider>
      </UserProvider>
    </div>
  );
};

export default App;
