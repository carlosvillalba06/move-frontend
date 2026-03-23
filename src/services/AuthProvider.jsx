import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { loginRequest } from "./authService";
import { getAdviserInformationRequest } from "./adviserService";
import { getAdminInformationRequest } from "./adminService";


function AuthProvider({ children }) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = localStorage.getItem("session");

      if (!storedSession) return;

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
    };

    loadSession();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await loginRequest(username, password);
      if (!data) return false;

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
        console.error("Error real:", error);
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

      return true;
    } catch (error) {
      console.error("Login error", error);
      return false;
    }
  };

  const logout = () => {
    setSession(null)
    localStorage.removeItem('session'),
      localStorage.removeItem('token')
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
