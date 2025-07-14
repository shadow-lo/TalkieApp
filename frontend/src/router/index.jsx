import { createBrowserRouter } from "react-router";
import { Data, Home, Login, NotFound, Signup, Talkie } from "../pages";
import { AuthLayout, MainLayout } from "../layouts";
import RouteGuard from "./RouteGuard";

const appRoutes = [
  {
    Component: AuthLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "login",
        element: (
          <RouteGuard>
            <Login />
          </RouteGuard>
        ),
      },
      {
        path: "signup",
        element: (
          <RouteGuard>
            <Signup />
          </RouteGuard>
        ),
      },
    ],
  },
  {
    Component: MainLayout,
    children: [
      {
        path: "talkie",
        element: (
          <RouteGuard requiresAuth>
            <Talkie />
          </RouteGuard>
        ),
      },
      {
        path: "take-data",
        element: (
          <RouteGuard requiresAuth>
            <Data />
          </RouteGuard>
        ),
      },
    ],
  },
  { path: "*", Component: NotFound },
];

export const routes = createBrowserRouter(appRoutes);
