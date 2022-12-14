import create from "zustand";

interface IUser {
  emailAddress: string;
}

/**
 * The Auth store has the current user (if authenticated). It is initiated at the start of the app and loads
 * token from local storage to check for existing authentication.
 */
interface IAuthStore {
  isAuthenticated: boolean;
  currentUser?: IUser;

  isFetching: boolean;
  isReady: boolean;

  initiate: () => void;
  setAuthentication: (isAuthenticated: boolean, user: IUser) => void;
}

const useAuth = create<IAuthStore>((set) => ({
  setupIsIncompleteError: false,
  isAuthenticated: false,
  isFetching: false,
  isReady: false,

  initiate: function () {
    const accessToken = window.localStorage.getItem("accessToken");
    if (!!accessToken) {
      // TODO: Verify with backend that this token is still valid
      set((state) => ({
        ...state,
        isReady: true,
        isAuthenticated: true,
      }));
    } else {
      set((state) => ({
        isReady: true,
        isAuthenticated: false,
      }));
    }
  },

  setAuthentication: function (isAuthenticated, user) {
    set((state) => ({
      ...state,
      isAuthenticated: isAuthenticated,
      currentUser: user,
    }));
  },
}));

export default useAuth;
