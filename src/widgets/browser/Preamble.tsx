import { Component, createMemo } from "solid-js";
import Heading from "../typography/Heading";
import { useQueryResult } from "../../stores/queryResult";
import { useWorkspace } from "../../stores/workspace";

const Preamble: Component = () => {
  const [queryResult] = useQueryResult();
  const [workspace] = useWorkspace();

  const getHeading = createMemo(() =>
    queryResult.query
      .map(
        (x) =>
          workspace.dataSourceList.find((ds) => ds.id === x.source)?.sourceName
      )
      .join(", ")
  );

  return (
    <div class="mb-2">
      <Heading size="xl">{getHeading()}</Heading>
    </div>
  );
};

export default Preamble;
