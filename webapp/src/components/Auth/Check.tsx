import { ReactNode } from "react";
import shallow from "zustand/shallow";

import useCurrentUser from "stores/currentUser";

interface IPropTypes {
  children: ReactNode;
}

function AuthCheck({ children }: IPropTypes) {
  const { isAuthenticated, isFetching, fetchError, user } = useCurrentUser(
    (store) => ({
      isAuthenticated: store.isAuthenticatied,
      isFetching: store.isFetching,
      fetchError: store.fetchError,
      user: store.user,
    }),
    shallow
  );

  return <>{children}</>;
}

export default AuthCheck;
