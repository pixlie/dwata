import { Component, createSignal } from "solid-js";
import Button from "../interactable/Button";
import TextInput from "../interactable/TextInput";
import TextArea from "../interactable/TextArea";

interface IFormState {
  isFormOpen: boolean;
}

const NewThread: Component = () => {
  const [formState, setFormState] = createSignal<IFormState>({
    isFormOpen: false,
  });
  const [formData, setFormData] = createSignal();

  const handleStartNewThread = () => {
    setFormState({
      isFormOpen: true,
    });
  };

  const handleNewThread = () => {
    console.log(formData());
  };

  return (
    <div class="my-3 bg-zinc-800 p-3 rounded-md max-w-screen-sm">
      {formState().isFormOpen ? (
        <>
          <TextArea />
          <div class="mb-4" />
          <Button label="Start a chat" onClick={handleNewThread} />
        </>
      ) : (
        <TextInput
          type="text"
          placeholder="Start a new chat"
          onFocus={handleStartNewThread}
        />
      )}
    </div>
  );
};

export default NewThread;
