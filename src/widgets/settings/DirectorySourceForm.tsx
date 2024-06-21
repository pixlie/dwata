import { Component } from "solid-js";
import { useParams } from "@solidjs/router";
import Form from "../interactable/ConfiguredForm";
import { Module } from "../../api_types/Module";
import withConfiguredForm from "../../utils/withConfiguredForm";
import { DirectorySourceCreateUpdate } from "../../api_types/DirectorySourceCreateUpdate";

const DirectorySourceForm: Component = () => {
  const params = useParams();

  const configuredForm = withConfiguredForm<DirectorySourceCreateUpdate>({
    module: "DirectorySource" as Module,
    existingItemId: !!params.id ? parseInt(params.id) : undefined,
    initialData: {
      path: "",
      label: "",
      includePatterns: [""],
      excludePatterns: [],
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

export default DirectorySourceForm;
