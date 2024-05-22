import { Component, createMemo, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { useUserInterface } from "../../stores/userInterface";
import { useNavigate } from "@solidjs/router";
import { DirectoryCreateUpdate } from "../../api_types/DirectoryCreateUpdate";
import { Configuration } from "../../api_types/Configuration";
import Form from "../interactable/Form";
import { Module } from "../../api_types/Module";

interface IState {
  isEditing: boolean;
  isSaving: boolean;
  isFetching: boolean;
}

const DirectorySourceForm: Component = () => {
  // const [state, setState] = createSignal<IState>({
  //   isEditing: false,
  //   isFetching: false,
  //   isSaving: false,
  // });
  const [formData, setFormData] = createSignal<DirectoryCreateUpdate>({
    path: "",
    label: "",
    includePatterns: [],
    excludePatterns: [],
  });
  const [formConfiguration, setFormConfiguration] =
    createSignal<Configuration>();
  const navigate = useNavigate();

  onMount(async () => {
    const response = await invoke("get_module_configuration", {
      module: "Directory" as Module,
    });
    setFormConfiguration(response as Configuration);
  });

  const visibleName = createMemo(() => {
    return !!formData().label
      ? `- ${formData().label}`
      : !!formData().path
        ? `- ${formData().path}`
        : "";
  });

  const handleChange = (field: string) => {
    if (field === "includePatterns" || field === "excludePatterns") {
      return (data: string) => {
        setFormData({
          ...formData(),
          [field]: data.split(","),
        });
      };
    } else {
      return (data: string | number) => {
        setFormData({
          ...formData(),
          [field]: data,
        });
      };
    }
  };

  const handleSubmit = async () => {
    const response = await invoke("create_folder_source", {
      path: formData().path,
      label: formData().label,
      includePatterns: formData().includePatterns,
      excludePatterns: formData().excludePatterns,
    });
    if (response) {
      navigate("/settings");
    }
  };

  return (
    <div class="max-w-screen-sm">
      <Form
        configuration={formConfiguration()}
        title="Directory Source"
        submitButtomLabel="Save"
        handleSubmit={handleSubmit}
        formData={formData()}
        onInput={setFormData}
      ></Form>
    </div>
  );
};

export default DirectorySourceForm;
