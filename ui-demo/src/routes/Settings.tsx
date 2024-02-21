import { Component, createSignal, onMount } from "solid-js";
import Heading from "../widgets/typography/Heading";
import DatabaseForm from "../widgets/settings/DatabaseForm";
import { Route, RouteSectionProps } from "@solidjs/router";

const SettingsIndex: Component = () => {
  const [sources, setSources] = createSignal();
  onMount(() => {});

  return (
    <>
      <Heading size="2xl">Index</Heading>
    </>
  );
};

const SettingsWrapper: Component<RouteSectionProps> = (props) => {
  return (
    <>
      <Heading size="3xl">Settings</Heading>
      <div class="mb-4" />

      <Heading size="xl">Data Sources</Heading>
      <div class="mb-6" />
      <a href="/settings/add">Add a data soruce</a>

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
