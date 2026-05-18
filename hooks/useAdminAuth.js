// hooks/useAdminAuth.js

import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { showError } from "../utils/verify";

export default function useAdminAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "/login";
      return;
    }
    setToken(accessToken);

    apiRequest("/auth/roles", { token: accessToken })
      .then((roles) => {
        if (!Array.isArray(roles) || !roles.includes("ROLE_ADMIN")) {
          window.location.href = "/";
        } else {
          setAuthenticated(true);
        }
      })
      .catch((e) => showError(e.message));
  }, []);

  return { authenticated, token };
}
