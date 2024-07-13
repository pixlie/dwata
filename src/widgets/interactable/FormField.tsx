import { Component } from "solid-js";
import TextInput from "./TextInput";
// import TextArea from "./TextArea";
import { IFormField } from "../../utils/types";
import TextInputArray from "./TextInputArray";
import Dropdown from "./Dropdown";
import TextArea from "./TextArea";
import HiddenInput from "./HiddenInput";

const FormField: Component<IFormField> = (props) => {
  let Field: Component<IFormField> | null = null; // Initialize Field with a default value

  if (props.isHidden) {
    Field = HiddenInput;
  } else {
    switch (props.contentType) {
      case "Text": {
        if ("textType" in props.contentSpec && !!props.contentSpec.textType) {
          switch (props.contentSpec.textType) {
            case "Email":
              Field = TextInput;
              break;
            case "Password":
              Field = TextInput;
              break;
            case "MultiLine":
              Field = TextArea;
              break;
            default:
              Field = TextInput;
              break;
          }
        } else {
          Field = TextInput;
        }
        break;
      }
      case "TextArray": {
        Field = TextInputArray;
        break;
      }
      case "SingleChoice": {
        Field = Dropdown;
        break;
      }
    }
  }

  if (!Field) {
    return null;
  }

  return <Field {...props} />;
};

export default FormField;
