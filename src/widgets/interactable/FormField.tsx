import { Component } from "solid-js";
import TextInput from "./TextInput";
// import TextArea from "./TextArea";
import { IFormField } from "../../utils/types";
import TextInputArray from "./TextInputArray";

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
