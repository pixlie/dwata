import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "components/Navbar";
import Setup from "screens/Setup";
import apiClient from "utils/apiClient";
import GoogleAuth from "screens/Authentication/GoogleAuth";
import InitAuthentication from "components/Auth/InitAuthentication";
import InitGlobalSettings from "components/Settings/InitGlobalSettings";
import RoutesPostAuth from "screens/Authentication/RoutesPostAuth";

function App(): JSX.Element {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(function () {
    async function inner() {
      /**
       * dwata/backend/env is the set of .env settings in the backend without which the backend
       * cannot function
       */

      try {
        const response = await apiClient.get("/settings/dwata");

        setIsFetching(false);
        setIsReady(true);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (
              error.response.status === 400 ||
              error.response.status === 500
            ) {
              setIsFetching(false);
              setIsReady(false);
            }
          }
        }
      }
    }

    inner();
  }, []);

  if (isFetching) {
    return <p>Loading...</p>;
  } else if (!isReady) {
    return (
      <>
        <p>
          You have not set the initial settings in <pre>dwata/backend/.env</pre>
        </p>
        <p>
          Please copy <pre>dwata/backend/.env.copy</pre> as a new file{" "}
          <pre>dwata/backend/.env</pre> and set the values as in comments
        </p>
      </>
    );
  }

  return (
    <BrowserRouter>
      <InitAuthentication />
      <InitGlobalSettings />
      <Navbar />

      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/auth" element={<GoogleAuth />} />
        <Route path="*" element={<RoutesPostAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
