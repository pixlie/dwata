import React, { useContext } from "react";

import { QueryContext } from "utils";
import { useData, useQuerySpecification, useSelected } from "services/store";
import { Button } from "components/LayoutHelpers";

export default ({
  label,
  size = "md",
  isEnabledWhen = () => false,
  handler = () => {},
}) => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const data = useData((state) => state[queryContext.key]);
  const selected = useSelected((state) => state[queryContext.key]);

  const handleClick = () => {
    handler({ querySpecification, data, selected });
  };

  return (
    <Button
      size={size}
      theme="secondary"
      disabled={!isEnabledWhen({ querySpecification, data, selected })}
      attributes={{ onClick: handleClick }}
    >
      {label}
    </Button>
  );
};
