import { Component, For, Setter } from "solid-js";
import Heading from "../typography/Heading";
import Button from "./Button";
import { IFormField } from "../../utils/types";
import FormField from "./FormField";

interface IPropTypes {
  title: string;
  formFields: Array<IFormField>;
  submitButtomLabel?: string;
  formData?: { [key: string]: any };
  setFieldInput?: Setter<{ [key: string]: any }>;
  handleSubmit?: () => {};
}

const Form: Component<IPropTypes> = (props) => {
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
    <div class="max-w-screen-sm">
      <div class="bg-zinc-700 px-4 py-3 rounded-md rounded-b-none">
        <Heading size="sm">{props.title}</Heading>
      </div>

      <div class="bg-zinc-800 px-4 pt-3 pb-4 rounded-md rounded-t-none">
        <For each={props.formFields}>
          {(field) => (
            <>
              <FormField {...field} onInput={handleChange(field.name)} />
              <div class="mt-4" />
            </>
          )}
        </For>

        {props.submitButtomLabel && (
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
