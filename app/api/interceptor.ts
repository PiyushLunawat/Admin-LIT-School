import fetchIntercept from "fetch-intercept";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const RegisterInterceptor = () => {
  fetchIntercept.register({
    request: function (url, config: RequestInit = {}) {
      if (
        url.includes("/auth/admin-login") ||
        url.includes("/auth/verify-admin-otp")
      ) {
        return [url, config]; // Return without adding Authorization header
      }

      const token = Cookies.get("accessToken");

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token || ""}`,
        "Content-Type": "application/json",
      };

      return [url, config];
    },

    requestError: function (error) {
      return Promise.reject(error);
    },

    response: function (response) {
      if (response.status === 401) {
        handleTokenRefresh(response); // Call separate function for async token refresh
      }

      return response; // Ensure a synchronous return type
    },

    responseError: function (error) {
      return Promise.reject(error);
    },
  });
};

/**
 * Handles refreshing the access token asynchronously.
 */
const handleTokenRefresh = async (response: Response) => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    clearAuthAndRedirect();
    return;
  }

  try {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include", // Include cookies for authentication
    });

    if (!refreshResponse.ok) throw new Error("Failed to refresh token");

    const { accessToken, newRefreshToken } = await refreshResponse.json();

    // Store new tokens in cookies
    Cookies.set("accessToken", accessToken, {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", newRefreshToken, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    // Retry the failed request
    return fetch(response.url, {
      method: response.type === "opaque" ? "GET" : response.statusText, // Ensure proper request method
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    clearAuthAndRedirect();
    return Promise.reject(error);
  }
};

/**
 * Clears authentication tokens and redirects to login.
 */
const clearAuthAndRedirect = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  // window.location.href = "/login";
};
