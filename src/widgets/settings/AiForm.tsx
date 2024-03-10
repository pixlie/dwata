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
    await invoke("create_ai_integration", {
      aiProvider: form().aiProvider,
      apiKey: form().apiKey,
      accountLabel: form().displayLabel,
    });
  };

  return (
    <div class="max-w-screen-sm">
      <div class="bg-zinc-700 px-4 py-3 rounded-md rounded-b-none">
        <Heading size="sm">AI Provider {visibleName()}</Heading>
      </div>

      <div class="bg-zinc-800 px-4 pt-3 pb-4 rounded-md rounded-t-none">
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
        <Button label="Save and start a chat!" onClick={handleConnect} />
      </div>
    </div>
  );
};

export default AiForm;
