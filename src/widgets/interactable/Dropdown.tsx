import { Component, For, JSX, createMemo } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";
import { IFormField } from "../../utils/types";

const Dropdown: Component<IFormField> = (props) => {
  const [_, { getColors }] = useUserInterface();
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
      {!!props.choicesWithHeadings ? (
        <For each={props.choicesWithHeadings}>
          {(heading) => (
            <>
              {/* <DropdownHeading label={heading.name} />
                  <For each={heading.choices}>
                    {(choice) => (
                      <DropdownItem
                        key={choice[0]}
                        label={choice[1]}
                        onSelect={handleChoiceSelect}
                      />
                    )}
                  </For> */}
            </>
          )}
        </For>
      ) : (
        <For each={props.choices}>
          {(choice) => <option value={choice[0]}>{choice[1]}</option>}
        </For>
      )}
    </select>
  );
};

export default Dropdown;
