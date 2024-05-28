import { Component } from "solid-js";
import { DatabaseSourceCreateUpdate } from "../../api_types/DatabaseSourceCreateUpdate";
import withConfiguredForm from "../../utils/configuredForm";
import { Module } from "../../api_types/Module";
import Form from "../interactable/Form";

const DatabaseSourceForm: Component = () => {
  const configuredForm = withConfiguredForm<DatabaseSourceCreateUpdate>({
    module: "DatabaseSource" as Module,
    initialData: {
      label: "",
      databaseType: "PostgreSQL",
      databaseName: "ecommerce",
      databaseHost: "",
      databasePort: 5432,
      databaseUsername: "postgres",
      databasePassword: "",
    },
    navtigateToAfterSave: "/settings",
  });
  return (
    <div class="max-w-screen-sm">
      <Form configuredForm={configuredForm} />
    </div>
  );
};

export default DatabaseSourceForm;
