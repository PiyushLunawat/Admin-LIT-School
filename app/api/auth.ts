export async function login(payload: { email: string; password: string }) {
  try {
    console.log(payload);
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

export async function adminRefreshToken(refreshPayload: any) {
  try {
    console.log("refffff", JSON.stringify(refreshPayload));

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
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error Refresh Token", error);
    throw error;
  }
}

export async function markNotificationsAsRead(payload: any) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/notifications/mark-as-read`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json(); // ✅ Return response if success
  } catch (error) {
    console.error("Error marking notifications as read", error);
    throw error; // ✅ Re-throw for upper layers to handle
  }
}
