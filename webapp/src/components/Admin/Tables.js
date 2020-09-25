import React from "react";

import { QueryContext } from "utils";
import { Hx } from "components/LayoutHelpers";
import Grid from "components/Grid";

export default () => {
  return (
    <div>
      <Hx x="3">Tables</Hx>

      <QueryContext.Provider value={{}}></QueryContext.Provider>
    </div>
  );
};
