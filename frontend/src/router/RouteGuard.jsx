import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

function RouteGuard({ children, requiresAuth }) {
  const { authUser } = useAuthStore();

  if (requiresAuth && !authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!requiresAuth && authUser) {
    return <Navigate to="/talkie" replace />;
  }

  return children;
}

export default RouteGuard;
