import React, { useEffect, useState } from "react";

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

export default ({}) => {
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

  return <div>{state.isApiReady ? <GoogleSignInButton /> : null}</div>;
};
