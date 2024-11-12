// app/api/cohort.ts

// Create a new cohort
export async function createCohort(data: any) {
    const response = await fetch("http://localhost:4000/admin/cohort", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create cohort");
    }
    return response.json();
  }
  
  // Fetch all cohorts
  export async function getCohorts() {
    const response = await fetch("http://localhost:4000/admin/cohort");
    if (!response.ok) {
      throw new Error("Failed to fetch cohorts");
    }
    return response.json();
  }
  
  // Delete a cohort by ID
  export async function deleteCohort(id: string) {
    const response = await fetch(`http://localhost:4000/admin/cohort/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete cohort");
    }
    return response.json();
  }
  
  // Update cohort details by ID
  export async function updateCohort(id: string, data: Partial<{  }>) {
    const response = await fetch(`http://localhost:4000/admin/cohort/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update cohort");
    }
    return response.json();
  }
  
  // Update cohort status by ID
  export async function updateCohortStatus(id: string, status: string) {
    const response = await fetch(`http://localhost:4000/admin/cohort/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error("Failed to update cohort status");
    }
    return response.json();
  }
  