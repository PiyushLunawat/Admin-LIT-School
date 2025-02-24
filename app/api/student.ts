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

  return response.json(); // Returns parsed JSON data
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
  return await response.json();
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
  try {
    console.log("x11", JSON.stringify(feedback));
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
      throw new Error("Failed to update task feedback");
    }

    return await response.json(); // Parse and return the response JSON
  } catch (error) {
    console.error("Error updating task feedback:", error);
    throw error;
  }
}

export async function updateStudentTaskFeedbackAccep(
  applicationId: string,
  applicationTaskId: string,
  subTaskId: string,
  newStatus: string,
  feedback: {
    feedbackData?: Array<{ taskId: string; feedback: string[] }>;
  }
) {
  try {
    console.log("x11", JSON.stringify(feedback));
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
      throw new Error("Failed to update task feedback");
    }

    return await response.json(); // Parse and return the response JSON
  } catch (error) {
    console.error("Error updating task feedback:", error);
    throw error;
  }
}

export async function updateLitmusTaskStatus(
  litmusTaskId: string,
  status: string,
  results: Array<{
    task: number;
    score: Array<{ criteria: string; score: number; totalScore: number }>;
  }>,
  feedbackData: Array<{ feedbackTitle: string; data: string[] }>,
  scholarshipDetail: string,
  performanceRating: number
) {
  const response = await fetch(
    `${process.env.API_URL}/admin/student/litmus/status/${litmusTaskId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        results,
        feedbackData,
        scholarshipDetail,
        performanceRating,
      }),
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json().catch(() => null); // Handle cases where the response is not JSON
    throw new Error(
      `${
        errorDetails
          ? `${errorDetails.message || JSON.stringify(errorDetails)}`
          : ""
      }`
    );
  }

  return response;
}

export async function updateScholarship(
  studentId: string,
  scholarshipId: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/admin/update-scholarship`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, scholarshipId }),
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
  } catch (error) {
    console.error("Error in updateScholarship:", error);
    throw error;
  }
}

// New API for uploading student documents
export async function uploadStudentDocuments(formData: any) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/admin/student-perosnal-docs`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function updateDocumentStatus(
  studentId: string,
  docType: string,
  docId: string,
  feedback: string,
  status: string
) {
  const response = await fetch(
    `${process.env.API_URL}/admin/student/document/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        docType,
        docId,
        feedback,
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update document status");
  }

  return await response.json();
}

// New API for uploading student documents
export async function uploadNewStudentDocuments(formData: any) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/admin/upload-student-doc`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function verifyTokenAmount(
  tokenId: string,
  comment: string,
  verificationStatus: string
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/admin/verify-token-amount`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId, comment, verificationStatus }),
      }
    );

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

    return await response; // Parse and return the response JSON
  } catch (error) {
    console.error("Error in verifyTokenAmount:", error);
    throw error;
  }
}

export default async function internalNotes(studentId: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/students/${studentId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

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

    return await response; // Parse and return the response JSON
  } catch (error) {
    console.error("Error in Internal Notes:", error);
    throw error;
  }
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
