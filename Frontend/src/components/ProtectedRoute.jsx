import { Navigate, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const location = useLocation();
    const isAuthenticated = authService.isAuthenticated();
    const userResult = authService.getCurrentUser();
    const user = userResult && userResult.profile ? userResult.profile : userResult;
    // Handle both cases where user might be the direct object or nested in profile

    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (adminOnly && user?.role?.toLowerCase() !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;
