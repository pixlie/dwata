import { Component, createMemo, createSignal, onMount } from "solid-js";
import Heading from "../typography/Heading";
import TextInput from "../interactable/TextInput";
import { IDatabase, IDatabaseFormData } from "../../utils/types";
import { useParams } from "@solidjs/router";
import Button from "../interactable/Button";
import { invoke } from "@tauri-apps/api/core";

interface IForm {
  isSaving: boolean;
  isFetching: boolean;
  payload?: IDatabaseFormData;
}

interface IState {
  isEditing: boolean;
}

const DatabaseForm: Component = () => {
  const [state, setState] = createSignal<IState>();
  const [form, setForm] = createSignal<IForm>({
    isFetching: false,
    isSaving: false,
  });
  const params = useParams();

  console.log(params);
  onMount(() => {
    setForm((state) => ({
      ...state,
      payload: {
        username: "postgres",
        // password: ,
        host: "localhost",
        port: 5432,
        name: "hearth",
      },
    }));
  });

  const visibleName = createMemo(() => {
    return !!form()?.payload?.label
      ? `- ${form()?.payload?.label}`
      : !!form()?.payload?.name
        ? `- ${form()?.payload?.name}`
        : "";
  });

  const handleConnect = async () => {
    console.log(form());
    const response = await invoke("check_database_connection", {
      username: form()?.payload?.username,
      password: form()?.payload?.password,
      host: form()?.payload?.host,
      port: `${form()?.payload?.port}`,
      database: form()?.payload?.name,
    });
    console.log(response as boolean);
  };

  return (
    <div class="rounded-md  bg-zinc-700 p-2">
      <Heading size="sm">Database {visibleName()}</Heading>

      <TextInput
        type="text"
        isRequired
        label="DB Host"
        value={form()?.payload?.host}
      />
      <TextInput
        type="text"
        isRequired
        label="DB Port"
        value={form()?.payload?.port}
      />
      <TextInput
        type="text"
        isRequired
        label="DB Username"
        value={form()?.payload?.username}
      />
      <TextInput
        type="text"
        isRequired
        label="DB Password"
        value={form()?.payload?.password}
      />
      <TextInput
        type="text"
        isRequired
        label="DB Name"
        value={form()?.payload?.name}
      />

      <Button label="Connect" onClick={handleConnect} />
    </div>
  );
};

export default DatabaseForm;
