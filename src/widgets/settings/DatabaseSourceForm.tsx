import { Component } from "solid-js";
import { Module } from "../../api_types/Module";
import Form from "../interactable/ConfiguredForm";

const DatabaseSourceForm: Component = () => {
  return (
    <div class="max-w-screen-sm">
      <Form
        module={"DatabaseSource" as Module}
        initialData={{
          label: "",
          databaseType: "PostgreSQL",
          databaseName: "ecommerce",
          databaseHost: "",
          databasePort: 5432,
          databaseUsername: "postgres",
          databasePassword: "",
        }}
        postSaveNavigateTo={"/settings"}
      />
    </div>
  );
};

export default DatabaseSourceForm;
