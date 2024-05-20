import { Component } from "solid-js";
import TextInput from "./TextInput";
// import TextArea from "./TextArea";
import { IFormField } from "../../utils/types";

const FormField: Component<IFormField> = (props) => {
  let Field: Component | undefined = undefined; // Initialize Field with a default value
  switch (props.field[0]) {
    case "Text": {
      Field = TextInput;
      break;
    }
    // case "multiLineText": {
    //   Field = TextArea;
    //   break;
    // }
  }

  if (!Field) {
    return <></>;
  }

  return <Field {...props} />;
};

export default FormField;
