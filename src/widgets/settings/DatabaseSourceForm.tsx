import { Component } from "solid-js";
import { DatabaseSourceCreateUpdate } from "../../api_types/DatabaseSourceCreateUpdate";
import withConfiguredForm from "../../utils/configuredForm";
import { Module } from "../../api_types/Module";
import Form from "../interactable/ConfiguredForm";

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
    postSaveNavigateTo: "/settings",
  });
  return (
    <div class="max-w-screen-sm">
      <Form
        formConfiguration={configuredForm.formConfiguration}
        formData={configuredForm.formData}
        handleChange={configuredForm.handleChange}
        handleSubmit={configuredForm.handleSubmit}
      />
    </div>
  );
};

export default DatabaseSourceForm;
