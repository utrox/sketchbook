import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // Show a loading state while waiting for the auth status
  // TODO: better loading component
  if (loading) return <div>Loading...</div>;

  // If user is not authenticated, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};
