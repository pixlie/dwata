import { createMemo, createSignal, onMount } from "solid-js";
import { Module } from "../api_types/Module";
import { Configuration } from "../api_types/Configuration";
import { invoke } from "@tauri-apps/api/core";
import { IFormFieldValue } from "./types";
import { ModuleDataRead } from "../api_types/ModuleDataRead";
import { ModuleDataCreateUpdate } from "../api_types/ModuleDataCreateUpdate";
import { useNavigate } from "@solidjs/router";

// interface IFormState {
//   isEditing: boolean;
//   isSaving: boolean;
//   isFetchingInitial: boolean;
// }

interface IConfiguredFormProps<T> {
  module: Module;
  existingItemId?: number;
  initialData?: Partial<T>;
  navtigateToAfterSave?: string;
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

  const handleInput = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));
    setDirty((state) => [...state, name]);
  };

  const handleSubmit = async () => {
    if (!!options.existingItemId) {
      const response = await invoke("update_module_item", {
        pk: options.existingItemId,
        data: {
          [options.module]: dirty().reduce(
            (acc, name) => ({ ...acc, [name]: formData()[name] }),
            {},
          ),
        },
      });
      if (!!response && !!options.navtigateToAfterSave) {
        navigate(options.navtigateToAfterSave);
      }
    } else {
      const response = await invoke("insert_module_item", {
        data: {
          [options.module]: formData(),
        },
      });
      if (!!response && !!options.navtigateToAfterSave) {
        navigate(options.navtigateToAfterSave);
      }
    }
  };

  return {
    handleInput,
    formData,
    formConfiguration,
    formDataHashMap,
    handleSubmit,
  } as const;
};

export type TConfiguredForm = ReturnType<typeof withConfiguredForm>;

export default withConfiguredForm;
