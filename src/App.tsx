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
import WorkspaceLoader from "./widgets/workspace/Loader";

const MainContent: Component<RouteSectionProps> = (props) => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div
      class="grow p-4"
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
    <UserProvider>
      <UserInterfaceProvider>
        <WorkspaceProvider>
          <SchemaProvider>
            <div class="flex flex-col w-full h-full">
              <WorkspaceLoader />
              <NavigationBar />

              <div class="flex bg-gray-300 grow h-full">
                <Sidebar />

                <MainContent {...props} />
              </div>
            </div>
          </SchemaProvider>
        </WorkspaceProvider>
      </UserInterfaceProvider>
    </UserProvider>
  );
};

export default App;
