import { Component, createMemo, createSignal } from "solid-js";
import Heading from "../typography/Heading";
import TextInput from "../interactable/TextInput";
import { IDatabaseFormData } from "../../utils/types";

interface IForm extends IDatabaseFormData {
  isSaving: boolean;
  isFetching: boolean;
}

const DatabaseForm: Component = () => {
  const [form, setForm] = createSignal<IForm>();

  const visibleName = createMemo(() => {
    return !!form()?.label
      ? `- ${form()?.label}`
      : !!form()?.name
        ? `- ${form()?.name}`
        : "";
  });

  return (
    <div class="rounded-md  bg-zinc-700 p-2">
      <Heading size="sm">Database {visibleName()}</Heading>

      <TextInput type="text" isRequired label="DB Host" value={form()?.host} />
      <TextInput type="text" isRequired label="DB Port" value={form()?.port} />
      <TextInput
        type="text"
        isRequired
        label="DB Username"
        value={form()?.username}
      />
      <TextInput
        type="text"
        isRequired
        label="DB Password"
        value={form()?.password}
      />
    </div>
  );
};

export default DatabaseForm;
