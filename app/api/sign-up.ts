export async function loginUser(email: string, password: string) {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Invalid email or password");
      }
  
      const data = await response.json();
      return data; // Return the response data (e.g., token or user details)
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }
  