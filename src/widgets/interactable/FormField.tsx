import { Component } from "solid-js";
import TextInput from "./TextInput";
// import TextArea from "./TextArea";
import { IFormField } from "../../utils/types";
import TextInputArray from "./TextInputArray";
import Dropdown from "./Dropdown";

const FormField: Component<IFormField> = (props) => {
  let Field: Component<IFormField> | null = null; // Initialize Field with a default value

  switch (props.contentType) {
    case "Text": {
      Field = TextInput;
      break;
    }
    case "TextArray": {
      Field = TextInputArray;
      break;
    }
    case "SingleChoice": {
      if ("choices" in props.contentSpec && !!props.contentSpec.choices) {
        props.choices = props.contentSpec.choices;
      }
      Field = Dropdown;
      break;
    }
    // case "multiLineText": {
    //   Field = TextArea;
    //   break;
    // }
  }

  if (!Field) {
    return null;
  }

  return <Field {...props} />;
};

export default FormField;
