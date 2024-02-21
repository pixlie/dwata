import shallow from "zustand/shallow";
import { useEffect } from "react";

import useAuth from "stores/auth";
import { useNavigate } from "react-router-dom";

function InitAuthentication(): null {
  const { isReady, isAuthenticated, initiate } = useAuth(
    (store) => ({
      isReady: store.isReady,
      isAuthenticated: store.isAuthenticated,
      initiate: store.initiate,
    }),
    shallow
  );
  const navigate = useNavigate();

  useEffect(
    function () {
      initiate();
    },
    [initiate]
  );

  useEffect(
    function () {
      if (isReady && !isAuthenticated) {
        navigate("/auth");
      }
    },
    [isReady, isAuthenticated]
  );

  return null;
}

export default InitAuthentication;
