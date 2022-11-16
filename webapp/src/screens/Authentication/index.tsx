import { GoogleLogin } from "@react-oauth/google";

import StandalonePage from "userInterface/standalonePage";
import apiClient from "utils/apiClient";

function Authentication(): JSX.Element {
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
