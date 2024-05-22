import { Component, createSignal, onMount } from "solid-js";
import Form from "../widgets/interactable/Form";
import { invoke } from "@tauri-apps/api/core";
import { useUser } from "../stores/user";
import { useNavigate } from "@solidjs/router";
import { Module } from "../api_types/Module";
import { Configuration } from "../api_types/Configuration";
import { ModuleDataCreateUpdate } from "../api_types/ModuleDataCreateUpdate";
import { UserAccountCreateUpdate } from "../api_types/UserAccountCreateUpdate";

const UserAccountForm: Component = () => {
  const [user, { fetchCurrentUser }] = useUser();
  const [formData, setFormData] = createSignal<UserAccountCreateUpdate>({
    firstName: null,
    lastName: null,
    email: null,
  });
  const [formConfiguration, setFormConfiguration] =
    createSignal<Configuration>();
  const navigate = useNavigate();

  onMount(async () => {
    const response = await invoke("get_module_configuration", {
      module: "UserAccount" as Module,
    });
    setFormConfiguration(response as Configuration);

    await fetchCurrentUser();
    if (!!user.account) {
      setFormData({
        firstName: user.account.firstName,
        lastName: user.account.lastName || null,
        email: user.account.email || null,
      });
    }
  });

  const handleSubmit = async () => {
    await invoke("upsert_module_item", {
      pk: 1,
      data: {
        UserAccount: {
          firstName: formData().firstName,
          lastName: formData().lastName,
          email: formData().email,
        },
      } as ModuleDataCreateUpdate,
    });
    navigate("/");
  };

  return (
    <div class="max-w-screen-sm">
      <Form
        configuration={formConfiguration()}
        title="My account"
        submitButtomLabel="Save"
        handleSubmit={handleSubmit}
        formData={formData()}
        onInput={setFormData}
      ></Form>
    </div>
  );
};

export default UserAccountForm;
