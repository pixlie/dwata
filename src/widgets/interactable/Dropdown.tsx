import {
  Component,
  For,
  JSX,
  createMemo,
  createResource,
  onMount,
} from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { IFormField } from "../../utils/types";
import { invoke } from "@tauri-apps/api/core";

const Dropdown: Component<IFormField> = (props) => {
  const [_, { getColors }] = useUserInterface();
  const [choicesFromFunction, { mutate: _m, refetch: refetchChoices }] =
    createResource<Array<[string, string]> | null>(async () => {
      if (
        "choicesFromFunction" in props.contentSpec &&
        !!props.contentSpec.choicesFromFunction
      ) {
        return await invoke<Array<[string, string]>>(
          props.contentSpec.choicesFromFunction,
        );
      }
      return null;
    });
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
    " rounded-md border " +
    `${props.displayBlock && "w-full"}`;

  const handleChange: JSX.EventHandler<HTMLSelectElement, Event> = (event) => {
    if (!!props.onChange) {
      props.onChange(props.name, event.currentTarget.value);
    }
  };

  onMount(() => {
    if (
      "choicesFromFunction" in props.contentSpec &&
      !!props.contentSpec.choicesFromFunction
    ) {
      refetchChoices();
    }
  });

  const getChoices = createMemo(() => {
    if ("choices" in props.contentSpec && !!props.contentSpec.choices) {
      return [
        ["__select__", "Select as AI model"],
        ...props.contentSpec.choices,
      ];
    } else if (
      "choicesFromFunction" in props.contentSpec &&
      !!props.contentSpec.choicesFromFunction
    ) {
      if (choicesFromFunction()) {
        return [
          ["__select__", "Select as AI model"],
          ...(choicesFromFunction() as Array<[string, string]>),
        ];
      }
    }
    return [];
  });

  return (
    <>
      {!!props.label && (
        <label class="block text-sm font-medium leading-6 text-gray-100 mb-2">
          {props.label}
        </label>
      )}
      <select
        onChange={handleChange}
        class={classes}
        style={{
          "border-color": getColors().colors["input.border"],
          color: getColors().colors["input.background"],
        }}
      >
        <For each={getChoices()}>
          {(choice) => (
            <option
              class="bg-white"
              value={choice[0]}
              selected={choice[0] === props.value}
            >
              {choice[1]}
            </option>
          )}
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
    </>
  );
};

export default Dropdown;
