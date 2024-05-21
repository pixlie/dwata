import { Component, For, JSX, Setter } from "solid-js";
import Heading from "../typography/Heading";
import Button from "./Button";
import FormField from "./FormField";
import { useUserInterface } from "../../stores/userInterface";
import { ConfigurationSchema } from "../../api_types/ConfigurationSchema";
import { IFormData } from "../../utils/types";

interface IPropTypes {
  configuration?: ConfigurationSchema;
  title?: string;
  submitButtomLabel?: string;
  submitButton?: JSX.Element;
  formData: IFormData;
  onInput?: Setter<IFormData>;
  handleSubmit?: () => {};
}

const Form: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();

  return (
    <div
      class="w-full rounded-md border"
      style={{
        "background-color": getColors().colors["inlineChat.background"],
        "border-color": getColors().colors["inlineChat.border"],
      }}
    >
      <div class="px-2 py-2 rounded-md rounded-b-none">
        <Heading size="xl">{props.configuration?.name || props.title}</Heading>

        <p style={{ color: getColors().colors["editor.foreground"] }}>
          {props.configuration?.description}
        </p>
      </div>

      <div class="px-2 pt-2 pb-3 rounded-md rounded-t-none">
        <For each={props.configuration?.fields}>
          {(field) => (
            <>
              <FormField
                {...field}
                onInput={props.onInput}
                value={props.formData[field.name]}
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
