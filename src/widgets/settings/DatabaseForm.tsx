import { Component, createMemo, createSignal } from "solid-js";
import Heading from "../typography/Heading";
import TextInput from "../interactable/TextInput";
import { IDatabaseFormData } from "../../utils/types";
import Button from "../interactable/Button";
import { invoke } from "@tauri-apps/api/core";
import { useUserInterface } from "../../stores/userInterface";
import { useNavigate } from "@solidjs/router";

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
  const navigate = useNavigate();
  const [_, { getColors }] = useUserInterface();

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
    if (response) {
      navigate("/settings");
    }
  };

  return (
    <div
      class="max-w-screen-sm border rounded-md"
      style={{
        "background-color": getColors().colors["editorWidget.background"],
        "border-color": getColors().colors["editorWidget.border"],
      }}
    >
      <div
        class="px-4 py-3 rounded-md rounded-b-none border-b"
        style={{
          "border-color": getColors().colors["editorWidget.border"],
        }}
      >
        <Heading size="sm">Database {visibleName()}</Heading>
      </div>

      <div class="px-4 pt-3 pb-4 rounded-md rounded-t-none">
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
    </div>
  );
};

export default DatabaseForm;
