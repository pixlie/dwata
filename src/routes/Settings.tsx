import { Component, onMount } from "solid-js";
import Heading from "../widgets/typography/Heading";
import DatabaseForm from "../widgets/settings/DatabaseForm";
import { Route, RouteSectionProps } from "@solidjs/router";
import Button from "../widgets/interactable/Button";
import SettingsSourceList from "../widgets/source/SettingsSourceList";

const SettingsIndex: Component = () => {
  onMount(() => {});

  return (
    <>
      <Heading size="xl">Data Sources</Heading>
      <SettingsSourceList />
      <div class="mb-2" />
      <Button label="Add a data soruce" href="/settings/add" size="sm"></Button>
      <div class="mb-6" />

      <Heading size="xl">LLM Integrations</Heading>
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
      <Route path="/add" component={DatabaseForm} />
      <Route path="/edit/:id" component={DatabaseForm} />
      <Route path="/" component={SettingsIndex} />
    </>
  );
};

export { SettingsWrapper, SettingsRoutes };
