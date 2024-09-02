import { Component } from "solid-js";
import { useUserInterface } from "../../stores/userInterface";

interface PaginationItemPropTypes {
  label: string;
  active?: boolean;
}

const PaginationItem: Component<PaginationItemPropTypes> = (props) => {
  return <div class="px-3 py-2">{props.label}</div>;
};

const Pagination: Component = () => {
  const [_, { getColors }] = useUserInterface();
  return (
    <div
      class="absolute bottom-0 left-0 right-0 h-20 justify-center pt-2"
      style={{
        color: getColors().colors["editor.foreground"],
        "background-color": getColors().colors["panel.background"],
      }}
    >
      <PaginationItem label="Previous" />
    </div>
  );
};

export default Pagination;
