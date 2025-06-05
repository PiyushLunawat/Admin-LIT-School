import fetchIntercept from "fetch-intercept";
import Cookies from "js-cookie";
import { adminRefreshToken } from "./auth";

const API_BASE_URL = process.env.API_URL;

let refreshingToken = false;

export const RegisterInterceptor = () => {
  fetchIntercept.register({
    request: async function (url, config: RequestInit = {}) {
      if (typeof url !== "string") {
        return [url, config];
      }

      const publicEndpoints = [
        "/auth/admin-login",
        "/auth/verify-admin-otp",
        "/auth/resend-admin-otp",
        "/auth/admin-refresh-token",
      ];

      const isPublic = publicEndpoints.some((endpoint) =>
        url.includes(endpoint)
      );

      if (isPublic) {
        return [url, config];
      }

      let accesstoken = Cookies.get("adminAccessToken");
      let reftoken = Cookies.get("adminRefreshToken");

      // console.log(
      //   "refresh ",
      //   !isPublic && !accesstoken && reftoken && !refreshingToken
      // );

      if (!isPublic && !accesstoken && reftoken && !refreshingToken) {
        refreshingToken = true;

        const payload = { refreshToken: `${reftoken}` };
        const refreshResponse = await adminRefreshToken(payload);
        Cookies.set("adminAccessToken", refreshResponse.accessToken, {
          expires: 1 / 12,
        });
        Cookies.set("adminRefreshToken", refreshResponse.refreshToken, {
          expires: 7,
        });
        accesstoken = refreshResponse.accessToken;
        reftoken = refreshResponse.refreshToken;
        refreshingToken = false;
      }

      if (!isPublic && !accesstoken && !reftoken) {
        // console.log("logout", url);
        await clearAuthAndRedirect();
      }

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accesstoken || ""}`,
        "Content-Type": "application/json",
      };
      return [url, config];
    },

    requestError: function (error) {
      return Promise.reject(error);
    },

    response: function (response) {
      return response;
    },
  });
};

// Clears authentication tokens and redirects to login.
const clearAuthAndRedirect = () => {
  Cookies.remove("adminAccessToken");
  Cookies.remove("adminRefreshToken");
  Cookies.remove("adminId");
  Cookies.remove("adminEmail");
  localStorage.clear();
  // window.location.href = "/login";
};
