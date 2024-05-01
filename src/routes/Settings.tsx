import { Component } from "solid-js";
import Heading from "../widgets/typography/Heading";
import DatabaseSourceForm from "../widgets/settings/DatabaseSourceForm";
import { Route, RouteSectionProps } from "@solidjs/router";
import Button from "../widgets/interactable/Button";
import SettingsSourceList from "../widgets/source/SettingsSourceList";
import AiForm from "../widgets/settings/AiForm";
import SettingsAIIntegrationList from "../widgets/ai/SettingsIntegrationList";
import FolderSourceForm from "../widgets/settings/FolderSourceForm";

const SettingsIndex: Component = () => {
  return (
    <>
      <Heading size="3xl">Data Sources</Heading>

      <Heading size="xl">Databases</Heading>
      <p>
        Connect to databases like MySQL, PostgreSQL, SQLite, MongoDB, etc and
        Dwata can extract schema or data from them.
      </p>
      <SettingsSourceList />
      <div class="mb-2" />
      <Button
        label="Add a database"
        href="/settings/database-source/add"
        size="sm"
      ></Button>
      <div class="mb-6" />

      <Heading size="xl">Folders</Heading>
      <SettingsSourceList />
      <div class="mb-2" />
      <Button
        label="Add a folder"
        href="/settings/folder-source/add"
        size="sm"
      ></Button>
      <div class="mb-6" />

      <Heading size="xl">AI Providers</Heading>
      <SettingsAIIntegrationList />
      <div class="mb-2" />
      <Button
        label="Add an AI provider"
        href="/settings/ai-provider/add"
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

      <Route path="/folder-source/add" component={FolderSourceForm} />
      <Route path="/folder-source/edit/:id" component={FolderSourceForm} />

      <Route path="/ai-provider/add" component={AiForm} />
      <Route path="/ai-provider/edit/:id" component={AiForm} />

      <Route path="/" component={SettingsIndex} />
    </>
  );
};

export { SettingsWrapper, SettingsRoutes };
