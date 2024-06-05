import {
  Component,
  For,
  JSX,
  createComputed,
  createMemo,
  createSignal,
} from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { IFormField } from "../../utils/types";
import { invoke } from "@tauri-apps/api/core";

const Dropdown: Component<IFormField> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const [choices, setChoices] = createSignal<Array<[string, string]>>([]);
  const getSizeClass = createMemo(() => {
    switch (props.size) {
      case "sm":
        return "px-2.5 py-1.5 text-sm font-normal";
      case "lg":
        return "px-6 py-3 text-xl font-bold";
      case "base":
      default:
        return "px-2 py-0.5 text-base font-normal";
    }
  });

  const classes =
    getSizeClass() +
    " rounded-md border hover:shadow-lg " +
    `${props.displayBlock && "w-full"}`;

  const handleChange: JSX.EventHandler<HTMLSelectElement, Event> = (event) => {
    if (!!props.onChange) {
      props.onChange(props.name, event.currentTarget.value);
    }
  };

  createComputed(async () => {
    console.log(props.contentSpec);
    if ("choices" in props.contentSpec && !!props.contentSpec.choices) {
      setChoices(props.contentSpec.choices);
    } else if (
      "choicesFromFunction" in props.contentSpec &&
      !!props.contentSpec.choicesFromFunction
    ) {
      const response = await invoke(props.contentSpec.choicesFromFunction);
      console.log(response);

      if (response) {
        setChoices(response as Array<[string, string]>);
      }
    }
    return [];
  });

  return (
    <select
      onChange={handleChange}
      class={classes}
      style={{
        "background-color": getColors().colors["input.background"],
        "border-color": getColors().colors["input.border"],
        color: getColors().colors["input.foreground"],
      }}
    >
      <For each={choices()}>
        {(choice) => <option value={choice[0]}>{choice[1]}</option>}
      </For>
      {/* {!!props.choicesWithHeadings ? (
        <For each={props.choicesWithHeadings}>
          {(heading) => (
            <>
              <DropdownHeading label={heading.name} />
                  <For each={heading.choices}>
                    {(choice) => (
                      <DropdownItem
                        key={choice[0]}
                        label={choice[1]}
                        onSelect={handleChoiceSelect}
                      />
                    )}
                  </For>
            </>
          )}
        </For>
      ) : (
      )} */}
    </select>
  );
};

export default Dropdown;
