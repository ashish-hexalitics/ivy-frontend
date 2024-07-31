import { Navigate } from "react-router-dom"
import { useAuthState } from "../contexts/authContext"

export const InvertedPrivateRoute = ({ children }) => {
    const { token, user } = useAuthState()

    if (token) {
        if (user?.role === 'customer')
            return <Navigate to='/reports' replace />
        return <Navigate to='/dashboard' replace />
    }

    return children;

};