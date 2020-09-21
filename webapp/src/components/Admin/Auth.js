import React from "react";

import { Hx } from "components/LayoutHelpers";

export default () => {
  return (
    <div className="rounded">
      <Hx x="3">Authentication</Hx>

      <p className="ml-3 max-w-xl">
        Current <strong>dwata</strong> only supports Google OAuth based
        authentication. You organization members will simply have to login using
        their Google account for your Business (Google Suite).
      </p>
    </div>
  );
};
