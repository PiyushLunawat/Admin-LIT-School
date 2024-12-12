// Centers

// Create a new center
export async function getCentres() {
  const response = await fetch(`${process.env.API_URL}/admin/center`);
  if (!response.ok) {
    throw new Error("Failed to fetch centres");
  }
  return response.json();
}

export async function createCentre(data: { name: string; location: string; suffix: string }) {
  const response = await fetch(`${process.env.API_URL}/admin/center`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create centre");
  }
  return response.json();
}

export async function updateCentre(id: string, data: { name: string; location: string; suffix: string }) {
  const response = await fetch(`${process.env.API_URL}/admin/center/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update centre");
  }
  
  return response.json();
}  

export async function updateCentreStatus(id: string, status: boolean) {
  const response = await fetch(`${process.env.API_URL}/admin/center/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Failed to update centre status");
  }
  return response.json();
}

export async function deleteCohort(id: string) {
  const response = await fetch(`${process.env.API_URL}/admin/cohort/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete cohort");
  }
  
  return response.json();
}
