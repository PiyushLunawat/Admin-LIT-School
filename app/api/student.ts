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
  const response = await fetch(`${process.env.API_URL}/admin/student/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
}

export async function updateStudentApplicationStatus(
  applicationId: string,
  status: string
) {
  const response = await fetch(
    `${process.env.API_URL}/admin/student/application?applicationId=${applicationId}&status=${status}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update student application status");
  }

  return response.json(); // Return the response as parsed JSON
}

export async function getStudentApplication(applicationId: string) {
  const response = await fetch(
    `${process.env.API_URL}/admin/student/application/${applicationId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch student application details");
  }

  return response.json();
}

export async function updateStudentData(data: any) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/admin/update-student-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // we send JSON as in the curl example
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update task feedback");
    }

    return await response.json(); // Parse and return the response JSON
  } catch (error) {
    console.error("Error updating task feedback:", error);
    throw error;
  }
}

export async function updateStudentTaskFeedback(
  applicationId: string,
  applicationTaskId: string,
  subTaskId: string,
  newStatus: string,
  feedback: {
    feedbackData?: string[];
  }
) {
  const response = await fetch(
    `${process.env.API_URL}/admin/student/application?applicationId=${applicationId}&applicationTaskId=${applicationTaskId}&subTaskId=${subTaskId}&status=${newStatus}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null);
    throw new Error(
      errorDetails
        ? `${errorDetails.message || JSON.stringify(errorDetails)}`
        : "Failed to update interview status"
    );
  }

  return response.json();
}

export async function updateStudentTaskFeedbackAccep(
  applicationId: string,
  applicationTaskId: string,
  subTaskId: string,
  status: string,
  feedback: {
    feedbackData?: Array<{ taskId: string; feedback: string[] }>;
  }
) {
  const response = await fetch(
    `${process.env.API_URL}/admin/student/application?applicationId=${applicationId}&applicationTaskId=${applicationTaskId}&subTaskId=${subTaskId}&status=${status}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null);
    throw new Error(
      errorDetails
        ? `${errorDetails.message || JSON.stringify(errorDetails)}`
        : "Failed to update interview status"
    );
  }

  return response.json();
}

export async function updateLitmusTaskStatus(
  litmusTaskId: string,
  payload: any
) {
  const response = await fetch(
    `${process.env.API_URL}/admin/student/litmus/status/${litmusTaskId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update document status");
  }

  return await response.json();
}

export async function updateScholarship(payLoad: any) {
  const response = await fetch(
    `${process.env.API_URL}/admin/update-scholarship`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payLoad),
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null); // Handle non-JSON responses
    throw new Error(
      `Failed to update scholarship. ${
        errorDetails
          ? `${errorDetails.message || JSON.stringify(errorDetails)}`
          : ""
      }`
    );
  }

  return await response.json(); // Parse and return the response JSON
}

// New API for uploading student documents
export async function uploadStudentDocuments(formData: any) {
  const response = await fetch(
    `${process.env.API_URL}/admin/upload-student-doc`,
    {
      method: "POST",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update document status");
  }

  return await response.json();
}

export async function updateDocumentStatus(payLoad: any) {
  const response = await fetch(
    `${process.env.API_URL}/admin/student/document/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payLoad),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update document status");
  }

  return await response.json();
}

export async function verifyTokenAmount(
  tokenId: string,
  comment: string,
  verificationStatus: string
) {
  const response = await fetch(
    `${process.env.API_URL}/admin/verify-token-amount`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId, comment, verificationStatus }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update document status");
  }

  return await response.json();
}

export async function uploadFeeReceipt(payload: any) {
  const response = await fetch(`${process.env.API_URL}/admin/add-receipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update fee status");
  }

  return await response.json();
}

export async function verifyFeeStatus(payload: any) {
  const response = await fetch(
    `${process.env.API_URL}/admin/verify-sem-fee-installments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update fee status");
  }

  return await response.json();
}

export async function updateInterviewStatus(jsonString: string) {
  const response = await fetch(
    `${process.env.API_URL}/admin/update-application-test/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // The correct header for JSON
      },
      body: jsonString, // The JSON payload
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null);
    throw new Error(
      errorDetails
        ? `${errorDetails.message || JSON.stringify(errorDetails)}`
        : "Failed to update interview status"
    );
  }

  return response.json();
}

export default async function internalNotes(notesPayload: any) {
  const response = await fetch(`${process.env.API_URL}/admin/internal-notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notesPayload),
  });

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null); // Handle non-JSON responses
    throw new Error(
      `Failed to verify token amount. ${
        errorDetails
          ? `${errorDetails.message || JSON.stringify(errorDetails)}`
          : ""
      }`
    );
  }

  return await response.json();
}

// API for Mark-as-dropped
export async function MarkAsdropped(payload: any) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/admin/mark-as-dropped`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // The correct header for JSON
        },
        body: JSON.stringify(payload),
      }
    );

    return await response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
