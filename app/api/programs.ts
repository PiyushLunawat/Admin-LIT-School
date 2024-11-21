// Program

// Fetch all programs
export async function getPrograms() {
  const response = await fetch(`${process.env.API_URL}/admin/program`);
  if (!response.ok) {
    throw new Error("Failed to fetch programs");
  }
  return response.json();
}

// Create a new program
export async function createProgram(data: { name: string; description: string; duration: number; prefix: string }) {
  const response = await fetch(`${process.env.API_URL}/admin/program`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create program");
  }
  return response.json();
}

// Update program details
export async function updateProgram(id: string, data: { name: string; description: string; duration: number; prefix: string }) {
  const response = await fetch(`${process.env.API_URL}/admin/program/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update program");
  }
  return response.json();
}

// Update program status (enable/disable)
export async function updateProgramStatus(id: string, status: boolean) {
  const response = await fetch(`${process.env.API_URL}/admin/program/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error("Failed to update program status");
  }
  return response.json();
}
