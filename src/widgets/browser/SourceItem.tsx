import { Component } from "solid-js";
import { APIGridSchema } from "../../api_types/APIGridSchema";
import { useQueryResult } from "../../stores/queryResult";

interface IPropTypes extends APIGridSchema {}

const SourceItem: Component<IPropTypes> = (props) => {
  const [_, { setGrid }] = useQueryResult();

  const icon = "fa-solid fa-table";
  const handleClick = () => {
    setGrid({
      source: props.source,
      schema: props.schema,
      table: props.name,
      columns: props.columns.map((x) => x.name),
      ordering: [],
      filtering: [],
    });
  };

  return (
    <div
      class="ml-4 mr-2 block rounded-md px-2 py-0.5 text-gray-200 hover:bg-zinc-700 cursor-pointer"
      onClick={handleClick}
    >
      <i class={`${icon} mr-1.5 text-sm text-gray-500`} />
      {props.name}
    </div>
  );
};

export default SourceItem;
