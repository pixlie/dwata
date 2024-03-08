import { Component } from "solid-js";
import { IFormField } from "../../utils/types";
import TextInput from "./TextInput";

interface IPropTypes extends IFormField {
  onInput?: (newValue: string | number | boolean) => void;
}

const FormField: Component<IPropTypes> = (props) => {
  let Field: Component | undefined = undefined; // Initialize Field with a default value
  switch (props.fieldType) {
    case "singleLineText": {
      Field = TextInput;
    }
  }

  if (!Field) {
    return <></>;
  }

  return <Field {...props} />;
};

export default FormField;
