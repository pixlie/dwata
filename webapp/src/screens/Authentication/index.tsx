import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import useGlobal from "stores/global";
import apiClient from "utils/apiClient";
import StandalonePage from "userInterface/standalonePage";

function Authentication(): JSX.Element {
  const navigate = useNavigate();
  const setAuthentication = useGlobal((store) => store.setAuthentication);

  return (
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
  );
}

export default Authentication;
