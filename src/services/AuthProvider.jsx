import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { loginRequest } from "./authService";
import { getAdviserInformationRequest } from "./adviserService";
import { getAdminInformationRequest } from "./adminService";

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = localStorage.getItem("session");

      if (!storedSession) {
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(storedSession);

      try {
        let fullUserInfo;

        if (parsed.user?.rol === "ADMIN") {
          const res = await getAdminInformationRequest();
          fullUserInfo = res?.data || res;
        } else {
          const res = await getAdviserInformationRequest();
          fullUserInfo = res?.data || res;
        }

        const updatedSession = {
          ...parsed,
          user: {
            ...parsed.user,
            ...fullUserInfo
          }
        };

        setSession(updatedSession);
        localStorage.setItem("session", JSON.stringify(updatedSession));
      } catch (error) {
        setSession(parsed);
      }

      setLoading(false);
    };

    loadSession();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await loginRequest(username, password);

      if (!data) {
        throw new Error("Bad credentials");
      }

      if (data.user?.rol === "STUDENT") {
        throw new Error("Unauthorized"); 
      }

      if (data.user?.status === false) {
        throw new Error("User is disabled"); 
      }

      let fullUserInfo = data.user;

      try {
        if (data.user?.rol === "ADMIN") {
          const res = await getAdminInformationRequest();
          fullUserInfo = res?.data || res;
        } else {
          const res = await getAdviserInformationRequest();
          fullUserInfo = res?.data || res;
        }
      } catch (error) {
        console.error("Error obteniendo info extra:", error);
      }

      const sessionData = {
        token: data.token,
        user: {
          ...data.user,
          ...fullUserInfo
        }
      };

      localStorage.setItem("session", JSON.stringify(sessionData));
      setSession(sessionData);
      setLoading(false);

      return true;

    } catch (error) {
      console.error("Login error", error);
      setLoading(false);

      throw error; 
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("session");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user,
        token: session?.token,
        login,
        logout,
        isLoggedIn: !!session,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;