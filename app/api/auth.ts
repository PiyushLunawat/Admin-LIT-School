export async function loginAdmin(payload: { email: string; password: string }) {
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

export async function verifyAdminOtp(email: string, otp: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/auth/verify-admin-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return await response.json(); // Parse and return the response JSON
  } catch (error) {
    console.error("Error OTP", error);
    throw error;
  }
}
