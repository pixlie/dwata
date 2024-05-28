import { Component, For, JSX, createMemo } from "solid-js";
import Heading from "../typography/Heading";
import Button from "./Button";
import FormField from "./FormField";
import { useUserInterface } from "../../stores/userInterface";
import { TConfiguredForm } from "../../utils/configuredForm";

interface IPropTypes {
  configuredForm: TConfiguredForm;
  title?: string;
  submitButtomLabel?: string;
  submitButton?: JSX.Element;
  handleSubmit?: () => {};
}

const Form: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const { handleChange, formConfiguration, formDataHashMap, handleSubmit } =
    props.configuredForm;

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
        <Heading size="xl">{formConfiguration()?.title || props.title}</Heading>

        <p style={{ color: getColors().colors["editor.foreground"] }}>
          {formConfiguration()?.description}
        </p>
      </div>

      <div class="px-2 pt-2 pb-3 rounded-md rounded-t-none">
        <For each={formConfiguration()?.fields}>
          {(field) => (
            <>
              <FormField
                {...field}
                onChange={handleChange}
                value={formDataHashMap()[field.name]}
              />
              <div class="mt-4" />
            </>
          )}
        </For>

        {!!props.submitButton ? (
          props.submitButton
        ) : (
          <Button
            label={props.submitButtomLabel || "Save"}
            onClick={props.handleSubmit || handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Form;
