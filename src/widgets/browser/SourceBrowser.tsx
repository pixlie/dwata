import { Component, For, createMemo } from "solid-js";
import { useSchema } from "../../stores/schema";
import SourceItem from "./SourceItem";
import SchemaLoader from "../SchemaLoader";
import { useSearchParams } from "@solidjs/router";

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

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <For each={tables()}>{(table) => <SourceItem {...table} />}</For>
    </div>
  );
};

const SourceBrowser: Component = () => {
  const [searchParams] = useSearchParams();

  if (!!searchParams.dataSourceId) {
    return (
      <>
        <SchemaLoader dataSourceId={searchParams.dataSourceId!} />
        <div class="w-full mb-4">
          <TableList dataSourceId={searchParams.dataSourceId!} />
        </div>
      </>
    );
  }
  return <></>;
};

export default SourceBrowser;
