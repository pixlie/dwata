import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { googleClientId } from "utils/variables";
import apiClient from "utils/apiClient";
import StandalonePage from "userInterface/standalonePage";
import useAuth from "stores/auth";

function GoogleAuth(): JSX.Element {
  const navigate = useNavigate();
  const setAuthentication = useAuth((store) => store.setAuthentication);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <StandalonePage title="Please login">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              const response = await apiClient.post("/auth/google", {
                credential: credentialResponse.credential,
              });
              if (response.data.is_authenticated) {
                window.localStorage.setItem(
                  "accessToken",
                  credentialResponse.credential
                );

                setAuthentication(true, { emailAddress: response.data.email });
                navigate("/");
              }
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </StandalonePage>
    </GoogleOAuthProvider>
  );
}

export default GoogleAuth;
