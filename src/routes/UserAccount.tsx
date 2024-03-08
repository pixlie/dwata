import { Component, createSignal } from "solid-js";
import { IFormField, IUserAccountFormData } from "../utils/types";
import Form from "../widgets/interactable/Form";
import { invoke } from "@tauri-apps/api/core";

const UserAccount: Component = () => {
  const [form, setForm] = createSignal<IUserAccountFormData>({
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
  ];

  const handleSubmit = async () => {
    console.log(form());
    await invoke("add_user", {
      firstName: form().firstName,
      lastName: form().lastName,
      email: form().email,
    });
  };

  return (
    <Form
      title="My account"
      formFields={formFields}
      submitButtomLabel="Save"
      handleSubmit={handleSubmit}
      setFieldInput={setForm}
    ></Form>
  );
};

export default UserAccount;
