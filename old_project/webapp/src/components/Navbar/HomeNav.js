import React from "react";

import { Button } from "components/LayoutHelpers";
import { useQueryContext } from "services/store";
import * as globalConstants from "services/global/constants";

export default () => {
  const setContext = useQueryContext((state) => state.setContext);

  const handleAdminClick = () => {
    setContext("main", {
      appType: globalConstants.APP_NAME_ADMIN,
    });
  };

  return (
    <div className="flex items-center">
      <div className="block lg:inline-block items-center flex-grow"></div>

      <div className="block lg:inline-block items-center">
        <Button theme="secondary">Watch a Demo</Button>
        <Button
          theme="secondary"
          attributes={{
            onClick: handleAdminClick,
          }}
        >
          Admin
        </Button>
      </div>
    </div>
  );
};
