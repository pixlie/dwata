import { Component, For, JSX, Setter } from "solid-js";
import Heading from "../typography/Heading";
import Button from "./Button";
import { IFormField } from "../../utils/types";
import FormField from "./FormField";
import { useUserInterface } from "../../stores/userInterface";

interface IPropTypes {
  title: string;
  formFields: Array<IFormField>;
  submitButtomLabel?: string;
  submitButton?: JSX.Element;
  formData?: { [key: string]: any };
  setFieldInput?: Setter<{ [key: string]: any }>;
  handleSubmit?: () => {};
}

const Form: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();

  const handleChange = (field: string) => {
    return (data: string | number) => {
      !!props.setFieldInput &&
        props.setFieldInput((state) => ({
          ...state,
          [field]: data,
        }));
    };
  };

  return (
    <div
      class="w-full rounded-md border"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
      }}
    >
      <div class="px-2 py-2 rounded-md rounded-b-none">
        <Heading size="base">{props.title}</Heading>
      </div>

      <div class="px-2 pt-2 pb-3 rounded-md rounded-t-none">
        <For each={props.formFields}>
          {(field) => (
            <>
              <FormField
                {...field}
                onInput={handleChange(field.name)}
                value={props.formData?.[field.name]}
              />
              <div class="mt-4" />
            </>
          )}
        </For>

        {!!props.submitButton && props.submitButton}
        {!!props.submitButtomLabel && !props.submitButton && (
          <Button
            label={props.submitButtomLabel}
            onClick={props.handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Form;
