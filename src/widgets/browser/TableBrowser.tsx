import { Component, For, createMemo } from "solid-js";
import { useSchema } from "../../stores/schema";
import SourceItem from "./SourceItem";
import SchemaLoader from "../SchemaLoader";
import { useSearchParams } from "@solidjs/router";
import { useUserInterface } from "../../stores/userInterface";

interface ITableListPropTypes {
  dataSourceId: string;
}

const TableList: Component<ITableListPropTypes> = (props) => {
  const [schema] = useSchema();

  const tables = createMemo(() => {
    if (!schema.isFetching && !!schema.isReady) {
      if (props.dataSourceId in schema.schemaForAllSources) {
        return schema.schemaForAllSources[props.dataSourceId];
      }
    }
    return [];
  });

  return <For each={tables()}>{(table) => <SourceItem {...table} />}</For>;
};

const TableBrowser: Component = () => {
  const [searchParams] = useSearchParams();
  const [_, { getColors }] = useUserInterface();

  if (!!searchParams.dataSourceId) {
    return (
      <>
        <SchemaLoader dataSourceId={searchParams.dataSourceId!} />

        <div
          class="w-full mb-4 p-2 border rounded-md flex flex-wrap"
          style={{ "border-color": getColors().colors["editorWidget.border"] }}
        >
          <TableList dataSourceId={searchParams.dataSourceId!} />
        </div>
      </>
    );
  }
  return null;
};

export default TableBrowser;
