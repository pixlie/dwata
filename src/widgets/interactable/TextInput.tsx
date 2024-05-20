import { Component, JSX } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { FormField } from "../../api_types/FormField";

interface IPropTypes extends FormField {
  value?: string | number;
  onInput?: (newValue: string | number) => void;
  onFocus?: () => void;
}

const TextInput: Component<IPropTypes> = (props) => {
  const [_, { getColors }] = useUserInterface();
  if (props.field[0] !== "Text") {
    return <></>;
  }

  let inputType: string = "text";
  if (!!props.field[1].textType) {
    const textType = props.field[1].textType;
    if (textType === "Email") {
      inputType = "email";
    } else if (textType === "Password") {
      inputType = "password";
    }
  }

  return (
    <>
      {!!props.label && (
        <label class="block text-sm font-medium leading-6 text-gray-100">
          {props.label}
        </label>
      )}
      <div class="mt-2">
        <input
          type={inputType}
          required={props.isRequired || undefined}
          class="block w-full rounded-md px-2 py-1.5 border"
          style={{
            "background-color": getColors().colors["input.background"],
            "border-color": getColors().colors["input.border"],
            color: getColors().colors["input.foreground"],
          }}
          placeholder={props.placeholder || undefined}
          value={props.value || ""}
          onInput={(e) => props.onInput?.(e.currentTarget.value)}
          onFocus={props.onFocus}
        />
      </div>
    </>
  );
};

export default TextInput;
