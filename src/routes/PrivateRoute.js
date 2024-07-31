import { Navigate } from "react-router-dom";
import { useAuthState } from "../contexts/authContext";

export const PrivateRoute = ({ children }) => {
  const { token } = useAuthState();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
