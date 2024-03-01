import { Component, createMemo, createSignal } from "solid-js";
import Heading from "../typography/Heading";
import TextInput from "../interactable/TextInput";
import { IAiFormData } from "../../utils/types";
import { invoke } from "@tauri-apps/api/core";
import Button from "../interactable/Button";

interface IState {
  isEditing: boolean;
  isSaving: boolean;
  isFetching: boolean;
}

const AiForm: Component = () => {
  const [state, setState] = createSignal<IState>({
    isEditing: false,
    isFetching: false,
    isSaving: false,
  });
  const [form, setForm] = createSignal<IAiFormData>({
    aiProvider: "OpenAI",
    apiKey: "",
    displayLabel: "personal",
  });
  // const params = useParams();

  const visibleName = createMemo(() => {
    return !!form().displayLabel
      ? `- ${form().displayLabel}`
      : !!form().aiProvider
        ? `- ${form().aiProvider}`
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
      aiProvider: form().aiProvider,
      apiKey: form().apiKey,
      accountLabel: form().displayLabel,
    });
  };

  return (
    <div class="rounded-md  bg-zinc-700 p-6 max-w-screen-sm">
      <Heading size="sm">Database {visibleName()}</Heading>

      <TextInput
        type="text"
        isRequired
        label="AI Provider"
        value={form().aiProvider}
        onInput={handleChange("aiProvider")}
      />

      <div class="mt-4" />
      <TextInput
        type="text"
        isRequired
        label="API Key"
        value={form().apiKey}
        onInput={handleChange("apiKey")}
      />

      <div class="mt-4" />
      <TextInput
        type="text"
        isRequired
        label="Account Label"
        value={form().displayLabel}
        onInput={handleChange("displayLabel")}
      />

      <div class="mt-4" />
      <Button label="Test connection and save" onClick={handleConnect} />
    </div>
  );
};

export default AiForm;
