// Cohorts

// Create a new cohort
export async function createCohort(data: any) {
  const response = await fetch(`${process.env.API_URL}/admin/cohort`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to create cohort ${response.status}`
    );
  }
  return response.json();
}

// Fetch all cohorts
export async function getCohorts() {
  const response = await fetch(`${process.env.API_URL}/admin/cohort`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to fetch cohort ${response.status}`
    );
  }
  return response.json();
}

// Delete a cohort by ID
export async function deleteCohort(id: string) {
  const response = await fetch(`${process.env.API_URL}/admin/cohort/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to delete cohort ${response.status}`
    );
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
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to update cohort ${response.status}`
    );
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
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to update cohort status ${response.status}`
    );
  }
  return response.json();
}

export async function getCohortById(id: string) {
  const response = await fetch(`${process.env.API_URL}/admin/cohort/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to fetch cohort details ${response.status}`
    );
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
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to invite cohort ${response.status}`
    );
  }
  return response.json();
}

export async function editCollaborator(data: any) {
  const response = await fetch(`${process.env.API_URL}/admin/collaborator`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to edit collaborators ${response.status}`
    );
  }
  return response.json();
}

export async function deleteCollaborator(data: any) {
  const response = await fetch(`${process.env.API_URL}/admin/collaborator`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to delete cohort ${response.status}`
    );
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
    return { success: false, message: error };
  }
}
