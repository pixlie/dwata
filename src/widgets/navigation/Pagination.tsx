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
      class="flex justify-center pt-2"
      style={{
        color: getColors().colors["editor.foreground"],
      }}
    >
      <PaginationItem label="Previous" />
    </div>
  );
};

export default Pagination;
