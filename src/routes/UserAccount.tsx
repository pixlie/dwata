import { Component, createSignal } from "solid-js";
import { IFormField } from "../utils/types";
import Form from "../widgets/interactable/Form";
import { invoke } from "@tauri-apps/api/core";

interface IUserAccountFormData {
  firstName: string;
  lastName?: string;
  email?: string;
}

const UserAccount: Component = () => {
  const [formData, setFormData] = createSignal<IUserAccountFormData>({
    firstName: "",
  });

  const formFields: Array<IFormField> = [
    {
      name: "firstName",
      label: "First Name",
      fieldType: "singleLineText",
      isRequired: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      fieldType: "singleLineText",
    },
    {
      name: "email",
      label: "Email",
      fieldType: "singleLineText",
    },
  ];

  const handleSubmit = async () => {
    await invoke("save_user", {
      firstName: formData().firstName,
      lastName: formData().lastName,
      email: formData().email,
    });
  };

  return (
    <Form
      title="My account"
      formFields={formFields}
      submitButtomLabel="Save"
      handleSubmit={handleSubmit}
      setFieldInput={setFormData}
    ></Form>
  );
};

export default UserAccount;
