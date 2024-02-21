import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal from "stores/global";
import shallow from "zustand/shallow";

function InitGlobalSettings(): null {
  const { hasSettingsError, isFetching, initiate } = useGlobal(
    (store) => ({
      hasSettingsError: store.hasSettingsError,
      isFetching: store.isFetching,
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
      if (!isFetching && hasSettingsError) {
        navigate("/setup/settings-error");
      }
    },
    [hasSettingsError, isFetching]
  );

  return null;
}

export default InitGlobalSettings;
