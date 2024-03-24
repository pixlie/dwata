import { Component, createMemo, createSignal } from "solid-js";
import Heading from "../typography/Heading";
import TextInput from "../interactable/TextInput";
import { IDatabaseFormData } from "../../utils/types";
// import { useParams } from "@solidjs/router";
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
  const [form, setForm] = createSignal<IDatabaseFormData>({
    username: "postgres",
    host: "localhost",
    port: 5432,
    name: "test",
  });
  // const params = useParams();

  const visibleName = createMemo(() => {
    return !!form().label
      ? `- ${form().label}`
      : !!form().name
        ? `- ${form().name}`
        : "";
  });

  const handleChange = (field: string) => {
    return (data: string | number) => {
      setForm({
        ...form(),
        [field]: data,
      });
    };
  };

  const handleConnect = async () => {
    const response = await invoke("create_data_source", {
      username: form().username,
      password: form().password,
      host: form().host,
      port: `${form().port}`,
      database: form().name,
    });
  };

  return (
    <div class="rounded-md  bg-zinc-700 p-6 max-w-screen-sm">
      <Heading size="sm">Database {visibleName()}</Heading>

      <TextInput
        type="text"
        isRequired
        label="DB Host"
        value={form().host}
        onInput={handleChange("host")}
      />

      <div class="mt-4" />
      <TextInput
        type="text"
        isRequired
        label="DB Port"
        value={form().port}
        onInput={handleChange("port")}
      />

      <div class="mt-4" />
      <TextInput
        type="text"
        isRequired
        label="DB Username"
        value={form().username}
        onInput={handleChange("username")}
      />

      <div class="mt-4" />
      <TextInput
        type="text"
        isRequired
        label="DB Password"
        value={form().password}
        onInput={handleChange("password")}
      />

      <div class="mt-4" />
      <TextInput
        type="text"
        isRequired
        label="DB Name"
        value={form().name}
        onInput={handleChange("name")}
      />

      <div class="mt-4" />
      <Button label="Test connection and save" onClick={handleConnect} />
    </div>
  );
};

export default DatabaseForm;
