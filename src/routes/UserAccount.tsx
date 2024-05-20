import { Component, createComputed, createSignal, onMount } from "solid-js";
import Form from "../widgets/interactable/Form";
import { invoke } from "@tauri-apps/api/core";
import { useUser } from "../stores/user";
import Heading from "../widgets/typography/Heading";
import { useNavigate } from "@solidjs/router";
import { ConfigurationSchema } from "../api_types/ConfigurationSchema";

interface IUserAccountFormData {
  firstName: string;
  lastName?: string;
  email?: string;
}

const UserAccount: Component = () => {
  const [user, { fetchCurrentUser }] = useUser();
  const [formData, setFormData] = createSignal<IUserAccountFormData>({
    firstName: "",
  });
  const [formConfiguration, setFormConfiguration] =
    createSignal<ConfigurationSchema>();
  const navigate = useNavigate();

  onMount(async () => {
    console.log("Calling get_configuration_schema");
    const response = await invoke("get_configuration_schema");
    console.log(response as ConfigurationSchema);

    setFormConfiguration(response as ConfigurationSchema);

    await fetchCurrentUser();
  });

  createComputed(() => {
    setFormData({
      firstName: user.account?.firstName || "",
      lastName: user.account?.lastName || "",
      email: user.account?.email || "",
    });
  });

  const handleSubmit = async () => {
    await invoke("save_user", {
      firstName: formData().firstName,
      lastName: formData().lastName,
      email: formData().email,
    });
    navigate("/");
  };

  return (
    <div class="max-w-screen-sm">
      <Heading size="3xl">Account</Heading>
      <div class="mb-4" />

      <Form
        formConfiguration={formConfiguration()}
        title="My account"
        submitButtomLabel="Save"
        handleSubmit={handleSubmit}
        formData={formData()}
        setFieldInput={setFormData}
      ></Form>
    </div>
  );
};

export default UserAccount;
