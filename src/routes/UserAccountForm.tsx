import { Component } from "solid-js";
import Form from "../widgets/interactable/Form";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "@solidjs/router";
import { Module } from "../api_types/Module";
import { ModuleDataCreateUpdate } from "../api_types/ModuleDataCreateUpdate";
import { UserAccountCreateUpdate } from "../api_types/UserAccountCreateUpdate";
import withConfiguredForm from "../utils/configuredForm";

const UserAccountForm: Component = () => {
  const navigate = useNavigate();

  let configuredForm = withConfiguredForm<UserAccountCreateUpdate>({
    module: "UserAccount" as Module,
    existingItemId: 1,
    initialData: {
      firstName: null,
      lastName: null,
      email: null,
    },
  });

  const handleSubmit = async () => {
    await invoke("upsert_module_item", {
      pk: 1,
      data: {
        UserAccount: {
          firstName: configuredForm.formData().firstName,
          lastName: configuredForm.formData().lastName,
          email: configuredForm.formData().email,
        },
      } as ModuleDataCreateUpdate,
    });
    navigate("/");
  };

  return (
    <div class="max-w-screen-sm">
      <Form
        configuredForm={configuredForm}
        title="My account"
        submitButtomLabel="Save"
        handleSubmit={handleSubmit}
      ></Form>
    </div>
  );
};

export default UserAccountForm;
