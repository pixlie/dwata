import { Component } from "solid-js";
import { useParams } from "@solidjs/router";
import Form from "../interactable/ConfiguredForm";
import { Module } from "../../api_types/Module";

const DirectorySourceForm: Component = () => {
  const params = useParams();

  return (
    <div class="max-w-screen-sm">
      <Form
        module={"DirectorySource" as Module}
        existingItemId={!!params.id ? parseInt(params.id) : undefined}
        initialData={{
          path: "",
          label: "",
          includePatterns: [""],
          excludePatterns: [],
        }}
        postSaveNavigateTo={"/settings"}
      />
    </div>
  );
};

export default DirectorySourceForm;
