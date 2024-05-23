import { Component, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "@solidjs/router";
import { DirectoryCreateUpdate } from "../../api_types/DirectoryCreateUpdate";
import { Configuration } from "../../api_types/Configuration";
import Form from "../interactable/Form";
import { Module } from "../../api_types/Module";
import { IFormFieldValue } from "../../utils/types";
import { ModuleDataCreateUpdate } from "../../api_types/ModuleDataCreateUpdate";

// interface IState {
//   isEditing: boolean;
//   isSaving: boolean;
//   isFetching: boolean;
// }

const DirectorySourceForm: Component = () => {
  // const [state, setState] = createSignal<IState>({
  //   isEditing: false,
  //   isFetching: false,
  //   isSaving: false,
  // });
  const [formData, setFormData] = createSignal<DirectoryCreateUpdate>({
    path: "",
    label: "",
    includePatterns: [""],
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

  const handleSubmit = async () => {
    const response = await invoke("insert_module_item", {
      data: {
        Directory: {
          path: formData().path,
          label: formData().label,
          includePatterns: formData().includePatterns,
          excludePatterns: formData().excludePatterns,
        },
      } as ModuleDataCreateUpdate,
    });
    if (response) {
      navigate("/settings");
    }
  };

  const handleInput = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return (
    <div class="max-w-screen-sm">
      <Form
        configuration={formConfiguration()}
        title="Directory Source"
        submitButtomLabel="Save"
        handleSubmit={handleSubmit}
        formData={Object.entries(formData()).reduce(
          (acc, [key, value]) => ({ ...acc, [key as string]: value }),
          {},
        )}
        onInput={handleInput}
      ></Form>
    </div>
  );
};

export default DirectorySourceForm;
