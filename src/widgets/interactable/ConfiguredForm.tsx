import { Accessor, Component, For, JSX } from "solid-js";
import Heading from "../typography/Heading";
import Button from "./Button";
import FormField from "./FormField";
import { useUserInterface } from "../../stores/userInterface";
import { Configuration } from "../../api_types/Configuration";
import { IFormFieldValue } from "../../utils/types";

interface IPropTypes {
  formConfiguration: Accessor<Configuration>;
  formData: Accessor<{ [key: string]: IFormFieldValue }>;
  handleChange: (name: string, value: IFormFieldValue) => void;
  handleSubmit: () => Promise<void>;
  title?: string;
  submitButtomLabel?: string;
  submitButton?: JSX.Element;
  showPrelude?: boolean;
}

const Form: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();

  const Inner = () => (
    <>
      {!!props.formConfiguration && (
        <For each={props.formConfiguration()?.fields}>
          {(field) => (
            <>
              <FormField
                {...field}
                onChange={props.handleChange}
                value={
                  !!props.formData && field.name in props.formData()
                    ? props.formData()[field.name]
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
        <Button
          label={props.submitButtomLabel || "Save"}
          onClick={props.handleSubmit}
        />
      )}
    </>
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
          <Heading size="xl">
            {props.formConfiguration()?.title || props.title}
          </Heading>

          <p style={{ color: getColors().colors["editor.foreground"] }}>
            {props.formConfiguration()?.description}
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
