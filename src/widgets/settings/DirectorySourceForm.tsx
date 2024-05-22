import { Component, createMemo, createSignal } from "solid-js";
import Heading from "../typography/Heading";
import TextInput from "../interactable/TextInput";
import { IFolderSourceFormData } from "../../utils/types";
import Button from "../interactable/Button";
import { invoke } from "@tauri-apps/api/core";
import { useUserInterface } from "../../stores/userInterface";
import { useNavigate } from "@solidjs/router";

interface IState {
  isEditing: boolean;
  isSaving: boolean;
  isFetching: boolean;
}

const DirectorySourceForm: Component = () => {
  const [state, setState] = createSignal<IState>({
    isEditing: false,
    isFetching: false,
    isSaving: false,
  });
  const [form, setForm] = createSignal<IFolderSourceFormData>({
    path: "",
    label: "",
    includePatterns: [],
    excludePatterns: [],
  });
  const navigate = useNavigate();
  const [_, { getColors }] = useUserInterface();

  const visibleName = createMemo(() => {
    return !!form().label
      ? `- ${form().label}`
      : !!form().path
        ? `- ${form().path}`
        : "";
  });

  const handleChange = (field: string) => {
    if (field === "includePatterns" || field === "excludePatterns") {
      return (data: string) => {
        setForm({
          ...form(),
          [field]: data.split(","),
        });
      };
    } else {
      return (data: string | number) => {
        setForm({
          ...form(),
          [field]: data,
        });
      };
    }
  };

  const handleConnect = async () => {
    const response = await invoke("create_folder_source", {
      path: form().path,
      label: form().label,
      includePatterns: form().includePatterns,
      excludePatterns: form().excludePatterns,
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
          label="Folder path"
          value={form().path}
          onInput={handleChange("path")}
        />

        <div class="mt-4" />
        <TextInput
          type="text"
          isRequired
          label="Label"
          value={form().label}
          onInput={handleChange("label")}
        />

        <div class="mt-4" />
        <TextInput
          type="text"
          isRequired
          label="Include patterns (like in .gitignore)"
          value={form().includePatterns.join(", ")}
          onInput={handleChange("includePatterns")}
        />

        <div class="mt-4" />
        <TextInput
          type="text"
          isRequired
          label="Exclude patterns"
          value={form().excludePatterns.join(", ")}
          onInput={handleChange("excludePatterns")}
        />

        <div class="mt-4" />
        <Button label="Save folder as data source" onClick={handleConnect} />
      </div>
    </div>
  );
};

export default DirectorySourceForm;
