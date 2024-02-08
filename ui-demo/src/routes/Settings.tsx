import { Component } from "solid-js";
import Heading from "../widgets/typography/Heading";
import DatabaseForm from "../widgets/settings/DatabaseForm";

const Settings: Component = () => {
  return (
    <>
      <Heading size="3xl">Settings</Heading>
      <div class="mb-4" />

      <Heading size="xl">Data Sources</Heading>
      <div class="border border-b border-gray-700" />

      <DatabaseForm />
    </>
  );
};

export default Settings;
