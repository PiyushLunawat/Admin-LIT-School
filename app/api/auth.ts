export async function login(payload: { email: string; password: string }) {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json(); // Parse and return the response JSON
  } catch (error) {
    console.error("Error Login", error);
    throw error;
  }
}

export async function verifyOtp(otpPayload: {
  otpRequestToken: string;
  otp: string;
}) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/auth/verify-admin-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otpPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error OTP", error);
    throw error;
  }
}

export async function resendOtp(resendPayload: { otpRequestToken: string }) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/auth/resend-admin-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resendPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error OTP", error);
    throw error;
  }
}

export async function refreshToken(refreshPayload: { refreshToken: string }) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/auth/admin-refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(refreshPayload),
      }
    );

    // If the server returns 4xx or 5xx, handle that
    if (!response.ok) {
      // Attempt to parse the error JSON
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // Now parse and return the JSON (the actual data)
    const data = await response.json();
    console.log("Refresh token response:", data);
    return data;
  } catch (error) {
    console.error("Error in refreshToken:", error);
    throw error;
  }
}
