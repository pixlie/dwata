import { Component, createComputed, createSignal, onMount } from "solid-js";
import Form from "../widgets/interactable/Form";
import { invoke } from "@tauri-apps/api/core";
import { useUser } from "../stores/user";
import Heading from "../widgets/typography/Heading";
import { useNavigate } from "@solidjs/router";
import { ConfigurationSchema } from "../api_types/ConfigurationSchema";
import { IFormData } from "../utils/types";

const UserAccount: Component = () => {
  const [user, { fetchCurrentUser }] = useUser();
  const [formData, setFormData] = createSignal<IFormData>({});
  const [formConfiguration, setFormConfiguration] =
    createSignal<ConfigurationSchema>();
  const navigate = useNavigate();

  onMount(async () => {
    const response = await invoke("get_configuration_schema", {
      module: "UserAccount",
    });
    setFormConfiguration(response as ConfigurationSchema);

    await fetchCurrentUser();
  });

  createComputed(() => {
    setFormData({
      firstName: { single: { Text: user.account?.firstName || "" } },
      lastName: { single: { Text: user.account?.lastName || "" } },
      email: { single: { Text: user.account?.email || "" } },
    });
  });

  const handleSubmit = async () => {
    console.log(formData());

    // await invoke("save_user", {
    //   firstName: formData().firstName,
    //   lastName: formData().lastName,
    //   email: formData().email,
    // });
    // navigate("/");
  };

  return (
    <div class="max-w-screen-sm">
      <Heading size="3xl">Account</Heading>
      <div class="mb-4" />

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

export default UserAccount;
