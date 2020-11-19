import React, { useState, useEffect } from "react";

const GoogleSignInButton = ({}) => {
  const GOOGLE_BUTTON_ID = "id-google-button";

  const onSuccess = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    console.log("Name: " + profile.getName());
    console.log("Email: " + profile.getEmail());
  };

  useEffect(() => {
    window.gapi.signin2.render(GOOGLE_BUTTON_ID, {
      width: 200,
      height: 50,
      onsuccess: onSuccess,
    });
  });

  return <div id={GOOGLE_BUTTON_ID} />;
};

export default () => {
  const [state, setState] = useState({
    isApiReady: false,
  });

  const postGAPILoad = () => {
    const result = window.gapi.auth2.init({
      client_id: "",
      scope: "email",
    });

    result.then(
      () => {
        setState({
          isApiReady: true,
        });
      },
      () => {
        alert("I broke");
      }
    );
  };

  useEffect(() => {
    const googleLoadTimer = setInterval(() => {
      if (window.gapi) {
        window.gapi.load("auth2", postGAPILoad);
        clearInterval(googleLoadTimer);
      }
    }, 100);
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-screen-sm mx-auto border rounded bg-white">
        <div className="p-4 border-gray-400 border-b">
          <h4>Login</h4>
        </div>

        <div className="p-4">
          {state.isApiReady ? <GoogleSignInButton /> : null}
        </div>
      </div>
    </div>
  );
};
