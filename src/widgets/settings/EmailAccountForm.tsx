import { Component } from "solid-js";
import { useParams } from "@solidjs/router";
import Form from "../interactable/ConfiguredForm";
import { Module } from "../../api_types/Module";

const EmailAccountForm: Component = () => {
  const params = useParams();

  return (
    <div class="max-w-screen-sm">
      <Form
        module={"EmailAccount" as Module}
        existingItemId={!!params.id ? parseInt(params.id) : undefined}
        postSaveNavigateTo={"/settings"}
      />
    </div>
  );
};

export default EmailAccountForm;
