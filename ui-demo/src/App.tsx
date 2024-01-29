import { Component } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";

import NavigationBar from "./widgets/navigation/NavigationBar";
import { UserProvider } from "./stores/user";
import SourceList from "./widgets/source/SourceList";

const App: Component<RouteSectionProps> = (props) => {
  return (
    <>
      <UserProvider>
        <NavigationBar />

        <div class="flex flex-row bg-gray-300">
          <div class="h-screen w-96 bg-gray-900 pt-12">
            <SourceList />
          </div>
          <div class="grow pt-12">{props.children}</div>
        </div>
      </UserProvider>
    </>
  );
};

export default App;
