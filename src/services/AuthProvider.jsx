import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { loginRequest } from "./authService";


function AuthProvider({ children }) {
    const [session, setSession] = useState(null)

    useEffect(() => {
        const storedSession = localStorage.getItem("session");

        if (storedSession) {
            setSession(JSON.parse(storedSession));
        }
    }, []);

    const login = async (username, password) => {
        try {
            const data = await loginRequest(username, password);

            if (!data) return false;

            const sessionData = {
                token: data.token,
                user: data.user
            };

            localStorage.setItem("session", JSON.stringify(sessionData));
            setSession(sessionData);

            return true;
        } catch (error) {
            console.error("Login error", error);
            return false;
        }
    };
    const logout = () => {
        setSession(null)
        localStorage.removeItem('session')
    }


    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user,
                token: session?.token,
                login,
                logout,
                isLoggedIn: !!session
            }}
        >{children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
