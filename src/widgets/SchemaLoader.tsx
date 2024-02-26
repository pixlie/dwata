import { Component, createComputed } from "solid-js";
import { useSchema } from "../stores/schema";

interface IPropTypes {
  dataSourceId: string;
}

const SchemaLoader: Component<IPropTypes> = (props) => {
  const [_, { readSchemaFromAPI }] = useSchema();

  createComputed(async () => {
    if (!!props.dataSourceId) {
      await readSchemaFromAPI(props.dataSourceId);
    }
  });

  return <></>;
};

export default SchemaLoader;
