import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
