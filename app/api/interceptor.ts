import fetchIntercept from "fetch-intercept";
import Cookies from "js-cookie";
import { refreshToken } from "./auth";

const API_BASE_URL = process.env.API_URL;

export const RegisterInterceptor = () => {
  fetchIntercept.register({
    request: function (url, config: RequestInit = {}) {
      if (typeof url !== "string") {
        return [url, config];
      }

      if (
        url.includes("/auth/admin-login") ||
        url.includes("/auth/verify-admin-otp") ||
        url.includes("/auth/admin-refresh-token")
      ) {
        // console.log("No Int.");
        return [url, config];
      }

      const token = Cookies.get("adminAccessToken");

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
      // console.log("Int Resp", response.status);
      if (response.status === 401) {
        handleTokenRefresh(response);
      }
      return response;
    },

    responseError: function (error) {
      return Promise.reject(error);
    },
  });
};

//Handles refreshing the access token asynchronously.
const handleTokenRefresh = async (response: Response) => {
  const token = Cookies.get("adminRefreshToken");
  if (!token) {
    // console.log("No refresh token");
    clearAuthAndRedirect();
    return;
  }

  try {
    const payload = { refreshToken: token };
    const refreshResponse = await refreshToken(payload);

    // console.log("refreshResponse", refreshResponse);

    const { accessToken, newRefreshToken } = await refreshResponse.json();

    // Store new tokens in cookies
    Cookies.set("adminAccessToken", accessToken, { expires: 1 / 12 });
    Cookies.set("adminRefreshToken", newRefreshToken, { expires: 7 });

    // Retry the failed request
    return fetch(response.url, {
      method: response.type === "opaque" ? "GET" : response.statusText, // Ensure proper request method
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    clearAuthAndRedirect();
    console.log("removing refresh token");
    return Promise.reject(error);
  }
};

// Clears authentication tokens and redirects to login.
const clearAuthAndRedirect = () => {
  // console.log("logout int.");
  Cookies.remove("adminAccessToken");
  Cookies.remove("adminRefreshToken");
  // window.location.href = "/login";
};
