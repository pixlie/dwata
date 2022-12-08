import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import shallow from "zustand/shallow";

import { googleClientId } from "utils/variables";
import useGlobal from "stores/global";
import Navbar from "components/Navbar";
import Home from "components/Home";
import Admin from "components/Admin";
import Grid from "components/Grid";
import Detail from "components/Detail";
import Notes from "components/Notes";
import Setup from "screens/Setup";
import apiClient from "utils/apiClient";
import Authentication from "screens/Authentication";

function AuthEnabledRoutes() {
  return (
    <>
      <Navbar />
      <div className="block clear-both" style={{ paddingBottom: "52px" }} />

      <Detail />
      <Notes />

      <Routes>
        <Route path="/browse" element={<Grid />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

function CheckAuthentication(): JSX.Element {
  const { isAuthenticated, isReady, initiate } = useGlobal(
    (store) => ({
      isAuthenticated: store.isAuthenticated,
      isReady: store.isReady,
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
        navigate("/login");
      }
    },
    [isAuthenticated, isReady]
  );

  return <></>;
}

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
        const response = await apiClient.get("/settings/dwata/backend/env");
        console.log(response);

        setIsFetching(false);
        setIsReady(true);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 400) {
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
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/setup" element={<Setup />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="" element={<CheckAuthentication />} />
          <Route path="" element={<AuthEnabledRoutes />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
