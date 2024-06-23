import {
  Component,
  For,
  JSX,
  createComputed,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import Heading from "../typography/Heading";
import Button from "./Button";
import FormField from "./FormField";
import { useUserInterface } from "../../stores/userInterface";
import { Configuration } from "../../api_types/Configuration";
import { IFormFieldValue } from "../../utils/types";
import { useNavigate } from "@solidjs/router";
import { Module } from "../../api_types/Module";
import { invoke } from "@tauri-apps/api/core";
import { ModuleDataRead } from "../../api_types/ModuleDataRead";
import { InsertUpdateResponse } from "../../api_types/InsertUpdateResponse";
import { nextTaskStore } from "../../stores/nextTask";

interface IPropTypes {
  module: Module;
  existingItemId?: number;
  initialData?: {
    [key: string]: IFormFieldValue;
  };
  postSaveNavigateTo?: string;
  initiateNextTask?: boolean;
  title?: string;
  submitButtomLabel?: string;
  submitButton?: JSX.Element;
  showPrelude?: boolean;
}

const Form: Component<IPropTypes> = (props) => {
  const [formData, setFormData] = createSignal<{
    [key: string]: IFormFieldValue;
  }>({});
  const [dirty, setDirty] = createSignal<Array<string>>([]);
  const navigate = useNavigate();
  const [_, { getColors }] = useUserInterface();

  const [config, { mutate: _m, refetch: refetchModuleConfiguration }] =
    createResource<Configuration>(async () => {
      return await invoke<Configuration>("get_module_configuration", {
        module: props.module,
      });
    });
  const [moduleData, { mutate: _mm, refetch: refetchModuleData }] =
    createResource<ModuleDataRead>(async () => {
      return await invoke<ModuleDataRead>("read_module_item_by_pk", {
        module: props.module,
        pk: props.existingItemId,
      });
    });

  createEffect((previousValuData) => {
    if (previousValuData !== props.initialData) {
      setFormData((state) => ({ ...state, ...props.initialData }));

      setDirty((state) => [
        ...state,
        ...Object.keys(props.initialData).filter((x) => !state.includes(x)),
      ]);
    }
  }, {});

  onMount(() => {
    refetchModuleConfiguration();
    // setFormConfiguration(config() as Configuration);

    if (props.existingItemId) {
      refetchModuleData();

      if (!!moduleData() && props.module in moduleData()!) {
        for (const [key, value] of Object.entries(
          moduleData()![props.module as keyof ModuleDataRead],
        )) {
          if (key in formData()) {
            setFormData((state) => ({
              ...state,
              [key as string]: value as IFormFieldValue,
            }));
          }
        }
      }
    }
  });

  const handleChange = (name: string, value: IFormFieldValue) => {
    setFormData((state) => ({
      ...state,
      [name]: value,
    }));

    setDirty((state) => (state.includes(name) ? state : [...state, name]));
  };

  const handleSubmit: JSX.EventHandler<HTMLFormElement, Event> = async (
    event,
  ) => {
    event.preventDefault();
    if (!!props.existingItemId) {
      console.info(
        `Submitting form data to update module ${props.module}, item ID ${props.existingItemId}`,
        formData(),
      );
      const response = await invoke<InsertUpdateResponse>(
        "update_module_item",
        {
          pk: props.existingItemId,
          data: {
            [props.module]: dirty().reduce(
              (acc, name) => ({ ...acc, [name]: formData()[name] }),
              {},
            ),
          },
        },
      );
      if (!!response && !!props.postSaveNavigateTo) {
        navigate(props.postSaveNavigateTo);
      }
    } else {
      console.info(
        `Submitting form data to insert into module: ${props.module}`,
        formData(),
      );
      console.log("handleSubmit, Form data:", formData(), "Dirty:", dirty());

      const response = await invoke<InsertUpdateResponse>(
        "insert_module_item",
        {
          data: {
            [props.module]: dirty().reduce(
              (acc, name) => ({ ...acc, [name]: formData()[name] }),
              {},
            ),
          },
        },
      );
      if (!!response) {
        if (!!props.initialData && !!response.nextTask) {
          // console.log(response);

          nextTaskStore[1].initiateTask({
            name: response.nextTask,
            arguments: response.arguments,
          });
          if (!!props.postSaveNavigateTo) {
            navigate(
              props.postSaveNavigateTo + "?nextTask=" + response.nextTask,
            );
          }
        }
        if (!!props.postSaveNavigateTo) {
          navigate(props.postSaveNavigateTo);
        }
      }
    }
  };

  const Inner = () => (
    <form onSubmit={handleSubmit}>
      {!!config() && (
        <For each={config()?.fields}>
          {(field) => (
            <>
              <FormField
                {...field}
                onChange={handleChange}
                value={
                  !!formData() && field.name in formData()
                    ? formData()[field.name]
                    : undefined
                }
              />
              <div class="mt-4" />
            </>
          )}
        </For>
      )}

      {!!props.submitButton ? (
        props.submitButton
      ) : (
        <Button label={props.submitButtomLabel || "Save"} />
      )}
    </form>
  );

  if (props.showPrelude !== undefined && !props.showPrelude) {
    return <Inner />;
  } else {
    return (
      <div
        class="w-full rounded-md border"
        style={{
          "background-color": getColors().colors["inlineChat.background"],
          "border-color": getColors().colors["inlineChat.border"],
        }}
      >
        <div
          class="px-2 py-2 rounded-md rounded-b-none border-b"
          style={{
            "border-color": getColors().colors["editorWidget.border"],
          }}
        >
          <Heading size="xl">{config()?.title || props.title}</Heading>

          <p style={{ color: getColors().colors["editor.foreground"] }}>
            {config()?.description}
          </p>
        </div>

        <div class="px-2 pt-2 pb-3 rounded-md rounded-t-none">
          <Inner />
        </div>
      </div>
    );
  }
};

export default Form;
