import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage, getUserFromLocalStorage, storeUserInLocalStorage } from "../utils/helper";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { useToastState } from "./toastContext";

const AuthContext = createContext({
    user: null,
    token: "",
    stats: null,
    loginUser: () => Promise.resolve(),
    logoutUser: () => { },
    getStats: () => { }
});

export const useAuthState = () => useContext(AuthContext);

export const AuthStateProvider = ({ children }) => {
    const navigate = useNavigate()
    const { triggerToast } = useToastState()

    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const response = getUserFromLocalStorage();
        if (response === null) {
            setUser(null);
            setToken("");
        } else {
            setToken(response?.token);
            setUser(response?.user);
        }
    }, []);

    const loginUser = useCallback(async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`,
                {
                    email,
                    password
                },
                { headers: { 'Content-Type': 'application/json' } }
            )
            const data = await response.data
            setToken(data?.data?.access_token);
            setUser({ name: data?.name, role: data?.type })
            storeUserInLocalStorage({ name: data?.name, role: data?.type }, data?.data?.access_token)
            navigate('/dashboard')
            triggerToast(data?.message, 'success')
        } catch (error) {
            triggerToast(error.response.data.message, 'error')
        }
    }, [navigate, triggerToast])

    const logoutUser = useCallback(() => {
        setUser(null);
        setToken("");
        clearLocalStorage();
        navigate('/')
        triggerToast('Logout successful!', 'success')
    }, [navigate, triggerToast]);

    const getStats = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/account/dashboard/stats`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            const data = await response.data.data;
            setStats(data);
        } catch (error) {
            console.log(error);
        }
    }, [token])

    useEffect(() => {
        if (token) {
            getStats()
        }
    }, [token, getStats])

    return (
        <AuthContext.Provider
            value={{ user, token, loginUser, logoutUser, stats, getStats }}
        >
            {children}
        </AuthContext.Provider>
    );
};
