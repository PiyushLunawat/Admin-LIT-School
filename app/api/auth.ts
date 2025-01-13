
export async function loginAdmin(email: string, password: string) {
    try {
      const response = await fetch(`${process.env.API_URL}/admin/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json().catch(() => null); // Handle non-JSON responses
        throw new Error(
          `Failed to verify token amount. ${
            errorDetails ? `${errorDetails.message || JSON.stringify(errorDetails)}` : ""
          }`
        );
      }
  
      const data = await response.json();
      return data; // Token or login info
    } catch (error) {
      console.error("Error during admin login:", error);
      throw error;
    }
  }
  