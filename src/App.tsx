import { Component } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";
import TopNavigationBar from "./widgets/navigation/TopNavigationBar";
import { UserProvider } from "./stores/user";
import Sidebar from "./widgets/navigation/Sidebar";
import { WorkspaceProvider } from "./stores/workspace";
import { SchemaProvider } from "./stores/schema";
import { UserInterfaceProvider } from "./stores/userInterface";
import { NextTaskProvider } from "./stores/nextTask";
import { ProcessLogLoader, ProcessLogProvider } from "./stores/processLog";
import { SearchableDataProvider } from "./stores/searchableData";
import {
  TailwindClassesProvider,
  useTailwindClasses,
} from "./stores/TailwindClasses";

const MainContent: Component<RouteSectionProps> = (props) => {
  const [_, { getClasses }] = useTailwindClasses();

  return (
    <>
      <ProcessLogLoader />
      <TopNavigationBar />

      <Sidebar />

      <main class={"pl-20 h-full w-full " + getClasses()["app"]}>
        <div class="px-8 pt-2 pb-24">
          {/* Main area */}
          {props.children}
        </div>
      </main>
    </>
  );
};

const App: Component<RouteSectionProps> = (props) => {
  return (
    <ProcessLogProvider>
      <UserProvider>
        <UserInterfaceProvider>
          <TailwindClassesProvider>
            <WorkspaceProvider>
              <SearchableDataProvider>
                <SchemaProvider>
                  <NextTaskProvider>
                    <MainContent {...props} />
                  </NextTaskProvider>
                </SchemaProvider>
              </SearchableDataProvider>
            </WorkspaceProvider>
          </TailwindClassesProvider>
        </UserInterfaceProvider>
      </UserProvider>
    </ProcessLogProvider>
  );
};

export default App;
