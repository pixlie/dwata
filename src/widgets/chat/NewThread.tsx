import { Component, createSignal } from "solid-js";
import Form from "../interactable/Form";
import { IFormField } from "../../utils/types";
import { invoke } from "@tauri-apps/api/core";
import Button from "../interactable/Button";

interface IFormState {
  isFormOpen: boolean;
}

interface INewThreadFormData {
  message: string;
  aiProvider: string;
  aiModel: string;
}

const NewThread: Component = () => {
  const [formData, setFormData] = createSignal<INewThreadFormData>({
    message: "",
    aiProvider: "OpenAI",
    aiModel: "gpt-4-turbo-preview",
  });

  const formFields: Array<IFormField> = [
    {
      name: "message",
      fieldType: "multiLineText",
      isRequired: true,
    },
  ];

  const handleNewThread = async () => {
    await invoke("start_chat_thread", {
      message: formData().message,
      aiProvider: formData().aiProvider,
      aiModel: formData().aiModel,
    });
  };

  return (
    <Form
      title="Start a new chat"
      formFields={formFields}
      // submitButtomLabel="Start"
      // handleSubmit={handleNewThread}
      setFieldInput={setFormData}
      submitButton={
        <Button size="sm" label="Start a chat" onClick={handleNewThread} />
      }
    ></Form>
  );
};

export default NewThread;
