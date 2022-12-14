import { useEffect } from "react";
import useGlobal from "stores/global";
import shallow from "zustand/shallow";

function InitGlobalSettings(): null {
  const { setupIsIncomplete, isFetching, initiate } = useGlobal(
    (store) => ({
      setupIsIncomplete: store.setupIsIncomplete,
      isFetching: store.isFetching,
      initiate: store.initiate,
    }),
    shallow
  );

  useEffect(
    function () {
      initiate();
    },
    [initiate]
  );

  useEffect(function () {}, [setupIsIncomplete, isFetching]);

  return null;
}

export default InitGlobalSettings;
