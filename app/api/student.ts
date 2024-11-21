export async function getStudents() {
    const response = await fetch(`${process.env.API_URL}/admin/students`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
  
    return response.json();
  }

  export async function getCurrentStudents(id: string) {
    const response = await fetch(`${process.env.API_URL}/admin/students/application/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
  
    return response.json(); // Returns parsed JSON data
  }
  