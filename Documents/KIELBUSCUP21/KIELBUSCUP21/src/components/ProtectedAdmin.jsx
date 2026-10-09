import {
  Navigate,
  useLocation,
} from "react-router-dom";

export default function ProtectedAdmin({
  children,
}) {
  const location = useLocation();

  const isLoggedIn =
    localStorage.getItem(
      "isAdminLoggedIn"
    ) === "true";

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/admin-login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}