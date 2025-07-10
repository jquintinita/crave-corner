// routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === role ? children : <Navigate to="/login" />;
}
