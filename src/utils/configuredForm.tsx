import { createMemo, createSignal, onMount } from "solid-js";
import { Module } from "../api_types/Module";
import { Configuration } from "../api_types/Configuration";
import { invoke } from "@tauri-apps/api/core";
import { IFormFieldValue } from "./types";
import { ModuleDataRead } from "../api_types/ModuleDataRead";
import { useNavigate } from "@solidjs/router";
import { InsertUpdateResponse } from "../api_types/InsertUpdateResponse";
import { nextTaskStore } from "../stores/nextTask";

// interface IFormState {
//   isEditing: boolean;
//   isSaving: boolean;
//   isFetchingInitial: boolean;
// }

interface IConfiguredFormProps<T> {
  module: Module;
  existingItemId?: number;
  initialData?: Partial<T>;
  postSaveNavigateTo?: string;
  initiateNextTask?: boolean;
}

const withConfiguredForm = <T extends {}>(options: IConfiguredFormProps<T>) => {
  const [formConfiguration, setFormConfiguration] =
    createSignal<Configuration>();
  const [formData, setFormData] = createSignal<T>(
    (options.initialData as T) || ({} as T),
  );
  const [dirty, setDirty] = createSignal<Array<string>>([]);
  const navigate = useNavigate();
  // const [formState, setFormState] = createSignal<IFormState>({
  //   isEditing: false,
  //   isSaving: false,
  //   isFetchingInitial: false,
  // })

  onMount(async () => {
    const response = await invoke("get_module_configuration", {
      module: options.module,
    });
    setFormConfiguration(response as Configuration);
    console.info("Form configuration:", response);

    if (options.existingItemId) {
      let result: ModuleDataRead = await invoke("read_module_item_by_pk", {
        module: options.module,
        pk: options.existingItemId,
      });

      if (!!result && options.module in result) {
        for (const [key, value] of Object.entries(result[options.module])) {
          if (key in formData()) {
            setFormData((state) => ({
              ...state,
              [key]: value,
            }));
          }
        }
      }
    }
  });

  const formDataHashMap = createMemo(() => {
    return !!formData()
      ? Object.entries(formData()).reduce(
          (acc, [key, value]) => ({ ...acc, [key as string]: value }),
          {},
        )
      : {};
  });

  const handleChange = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));
    setDirty((state) => [...state, name]);
  };

  const handleSubmit = async () => {
    if (!!options.existingItemId) {
      console.info(
        `Submitting form data to update module ${options.module}, item ID ${options.existingItemId}`,
        formData(),
      );
      const response = await invoke<InsertUpdateResponse>(
        "update_module_item",
        {
          pk: options.existingItemId,
          data: {
            [options.module]: dirty().reduce(
              (acc, name) => ({ ...acc, [name]: formData()[name] }),
              {},
            ),
          },
        },
      );
      if (!!response && !!options.postSaveNavigateTo) {
        navigate(options.postSaveNavigateTo);
      }
    } else {
      console.info(
        `Submitting form data to insert into module: ${options.module}`,
        formData(),
      );
      const response = await invoke<InsertUpdateResponse>(
        "insert_module_item",
        {
          data: {
            [options.module]: formData(),
          },
        },
      );
      if (!!response) {
        if (!!options.initialData && !!response.nextTask) {
          console.log(response);

          nextTaskStore[1].initiateTask({
            name: response.nextTask,
            arguments: response.arguments,
          });
          if (!!options.postSaveNavigateTo) {
            navigate(
              options.postSaveNavigateTo + "?nextTask=" + response.nextTask,
            );
          }
        }
        if (!!options.postSaveNavigateTo) {
          navigate(options.postSaveNavigateTo);
        }
      }
    }
  };

  return {
    handleChange,
    formData,
    formConfiguration,
    formDataHashMap,
    handleSubmit,
  } as const;
};

export type TConfiguredForm = ReturnType<typeof withConfiguredForm>;

export default withConfiguredForm;
