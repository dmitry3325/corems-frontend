import { createBrowserRouter, redirect } from "react-router-dom";

import App from "@/app/App";
import NotFound from "@/app/layout/NotFound";
import { store } from "@/app/Store";
import AuthForm from "@/user/component/auth/AuthForm";

console.log("Router Init");

export const ROUTE_HOME = "/";

// Auth service
export const ROUTE_LOGIN = "/login";
export const ROUTE_USER = "/user";

export const ROUTE_PRICING = "/pricing";
export const ROUTE_FEATURES = "/features";

const redirectIfNotAuthenticated = () => {
  const { auth } = store.getState();

  if (!auth.isAuthenticated) {
    return redirect(ROUTE_LOGIN);
  }

  return true;
};

export const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: ROUTE_HOME,
        element: <div>HOME</div>,
      },
      {
        path: ROUTE_LOGIN,
        element: <AuthForm />,
      },
      {
        path: ROUTE_USER,
        element: <div>UserInfo</div>,
        loader: redirectIfNotAuthenticated,
      },
      {
        path: ROUTE_PRICING,
        element: <div>Pricing </div>,
        loader: redirectIfNotAuthenticated,
      },
      {
        path: ROUTE_FEATURES,
        element: <div>Features </div>,
        loader: redirectIfNotAuthenticated,
      },
    ]
  },
]);

