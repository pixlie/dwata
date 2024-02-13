import { Component, createMemo, createSignal, onMount } from "solid-js";
import Heading from "../typography/Heading";
import TextInput from "../interactable/TextInput";
import { IDatabaseFormData } from "../../utils/types";
import { useParams } from "@solidjs/router";
import Button from "../interactable/Button";
import { invoke } from "@tauri-apps/api/core";

interface IState {
  isEditing: boolean;
  isSaving: boolean;
  isFetching: boolean;
}

const DatabaseForm: Component = () => {
  const [state, setState] = createSignal<IState>({
    isEditing: false,
    isFetching: false,
    isSaving: false,
  });
  const [form, setForm] = createSignal<IDatabaseFormData>();
  const params = useParams();

  console.log(params);
  onMount(() => {
    setForm({
      username: "postgres",
      // password: ,
      host: "localhost",
      port: 5432,
      name: "test",
    });
  });

  const visibleName = createMemo(() => {
    return !!form()?.label
      ? `- ${form()?.label}`
      : !!form()?.name
        ? `- ${form()?.name}`
        : "";
  });

  const handleConnect = async () => {
    const response = await invoke("add_data_source", {
      username: form()?.username,
      password: form()?.password,
      host: form()?.host,
      port: `${form()?.port}`,
      database: form()?.name,
    });
    console.log(response as string);
  };

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
      <TextInput type="text" isRequired label="DB Name" value={form()?.name} />

      <Button label="Test connection and save" onClick={handleConnect} />
    </div>
  );
};

export default DatabaseForm;
