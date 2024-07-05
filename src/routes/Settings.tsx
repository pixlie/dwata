import { Component, onMount } from "solid-js";
import Heading from "../widgets/typography/Heading";
import DatabaseSourceForm from "../widgets/settings/DatabaseSourceForm";
import { Route, RouteSectionProps } from "@solidjs/router";
import Button from "../widgets/interactable/Button";
// import SettingsSourceList from "../widgets/settings/SettingsSourceList";
import AIIntegrationForm from "../widgets/settings/AIIntegrationForm";
import SettingsAIIntegrationList from "../widgets/settings/SettingsIntegrationList";
import DirectorySourceForm from "../widgets/settings/DirectorySourceForm";
import { useWorkspace } from "../stores/workspace";

const SettingsIndex: Component = () => {
  const [_w, { readAIIntegrationList }] = useWorkspace();

  onMount(async () => {
    // await readDirectoryList();
    // await readDatabaseList();
    await readAIIntegrationList();
  });

  return (
    <>
      {/* <Heading size="xl">Data Sources</Heading>
      <p
        class="p-4 text-white rounded-md border cursor-default select-none text-sm mb-2"
        style={{
          "background-color": getColors().colors["panel.background"],
          "border-color": getColors().colors["panel.border"],
        }}
      >
        Connect to databases like MySQL, PostgreSQL, SQLite, MongoDB, etc and
        Dwata can extract schema or data from them.
        <br />
        Import files like Markdown from directories.
      </p>
      <SettingsSourceList />
      <div class="mb-2" />
      <div class="flex flex-row gap-2">
        <Button
          label="Add a Database"
          href="/settings/database-source/add"
          size="sm"
        ></Button>
        <Button
          label="Add a Directory"
          href="/settings/directory-source/add"
          size="sm"
        ></Button>
      </div>
      <div class="mb-6" /> */}

      <Heading size="xl">AI Providers</Heading>
      <SettingsAIIntegrationList />
      <div class="mb-2" />
      <Button
        label="Add an AI provider"
        href="/settings/ai-integration/add"
        size="sm"
      ></Button>
      <div class="mb-6" />
    </>
  );
};

const SettingsWrapper: Component<RouteSectionProps> = (props) => {
  return (
    <>
      <Heading size="3xl">Settings</Heading>
      <div class="mb-4" />

      {props.children}
    </>
  );
};

const SettingsRoutes: Component = () => {
  return (
    <>
      <Route path="/database-source/add" component={DatabaseSourceForm} />
      <Route path="/database-source/edit/:id" component={DatabaseSourceForm} />

      <Route path="/directory-source/add" component={DirectorySourceForm} />
      <Route
        path="/directory-source/edit/:id"
        component={DirectorySourceForm}
      />

      <Route path="/ai-integration/add" component={AIIntegrationForm} />
      <Route path="/ai-integration/edit/:id" component={AIIntegrationForm} />

      <Route path="/" component={SettingsIndex} />
    </>
  );
};

export { SettingsWrapper, SettingsRoutes };
