import { Component } from "solid-js";
import Heading from "../widgets/typography/Heading";
import DatabaseForm from "../widgets/settings/DatabaseForm";
import { Route, RouteSectionProps } from "@solidjs/router";
import Button from "../widgets/interactable/Button";
// import SettingsSourceList from "../widgets/source/SettingsSourceList";
import AiForm from "../widgets/settings/AiForm";
import SettingsAIIntegrationList from "../widgets/ai/SettingsIntegrationList";

const SettingsIndex: Component = () => {
  return (
    <>
      {/* <Heading size="xl">Data Sources</Heading>
      <SettingsSourceList />
      <div class="mb-2" />
      <Button
        label="Add a data soruce"
        href="/settings/data-source/add"
        size="sm"
      ></Button>
      <div class="mb-6" /> */}

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
      <Route path="/data-source/add" component={DatabaseForm} />
      <Route path="/data-source/edit/:id" component={DatabaseForm} />

      <Route path="/ai-provider/add" component={AiForm} />
      <Route path="/ai-provider/edit/:id" component={AiForm} />

      <Route path="/" component={SettingsIndex} />
    </>
  );
};

export { SettingsWrapper, SettingsRoutes };
