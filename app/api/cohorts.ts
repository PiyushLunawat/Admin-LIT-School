// Cohorts

// Create a new cohort
export async function createCohort(data: any) {
  const response = await fetch(`${process.env.API_URL}/admin/cohort`, {
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
  const response = await fetch(`${process.env.API_URL}/admin/cohort`);
  if (!response.ok) {
    throw new Error("Failed to fetch cohorts");
  }
  return response.json();
}

// Delete a cohort by ID
export async function deleteCohort(id: string) {
  const response = await fetch(`${process.env.API_URL}/admin/cohort/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete cohort");
  }
  return response.json();
}

// Update cohort details by ID
export async function updateCohort(id: string, data: any) {
  const response = await fetch(`${process.env.API_URL}/admin/cohort/${id}`, {
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
  const response = await fetch(
    `${process.env.API_URL}/admin/cohort/status/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update cohort status");
  }
  return response.json();
}

export async function getCohortById(id: string) {
  const response = await fetch(`${process.env.API_URL}/admin/cohort/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch cohort details");
  }
  return response.json();
}

// Invite collaborators to a cohort
export async function inviteCollaborators(id: string) {
  const response = await fetch(
    `${process.env.API_URL}/admin/invite-collaborators/${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to invite collaborators to cohort");
  }
  return response.json();
}

export async function checkEmailExists(email: string) {
  try {
    const res = await fetch(
      `https://dev.cal.litschool.in/api/application-portal/user-checking?email=${email}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    // Return a default fallback
    return { success: false, message: error };
  }
}
