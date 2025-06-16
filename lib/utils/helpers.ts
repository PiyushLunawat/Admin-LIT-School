import ExcelJs from "exceljs";

export const formatAmount = (value: number | undefined) => {
  return value !== undefined
    ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        Math.round(value)
      )
    : "--";
};

export function KLsystem(amount: number): string {
  if (amount === 0) {
    return `--`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`; // Converts to 'L' format with two decimal places
  } else {
    return `₹${(amount / 1000).toFixed(2)}K`; // Converts to 'K' format with two decimal places
  }
}

export const formatInput = (value: string): string => {
  const lines = value.split("\n");
  const formattedLines = lines.filter((line) => {
    const trimmed = line.trimStart();
    return trimmed.startsWith("• ");
  });
  return formattedLines.join("\n");
};

export const generateUniqueFileName = (
  originalName: string,
  folder?: string
) => {
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/\s+/g, "-");
  return `${folder}/${timestamp}-${sanitizedName}`;
};

export const handleFileDownload = async (
  url: string,
  fileName: string,
  fileType: string
) => {
  try {
    // 1. Fetch the file as Blob
    const response = await fetch(url);
    const blob = await response.blob();

    // 2. Create a temporary object URL for that Blob
    const blobUrl = URL.createObjectURL(blob);

    // 3. Create a hidden <a> and force download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${fileName}.${fileType}`; // or "myImage.png"
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed", err);
  }
};

export const handleBulkExport = async (selectedStudents: any[]) => {
  if (selectedStudents.length === 0) {
    console.log("No students selected for export.");
    return;
  }

  // Create a new workbook and worksheet
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Students");

  // Define columns with explicit types
  worksheet.columns = [
    { header: "Student's Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone No.", key: "phone", width: 15, style: { numFmt: "@" } },
    { header: "Address", key: "address", width: 40 },
    { header: "Fathers' Name", key: "fatherName", width: 20 },
    {
      header: "Father's Contact",
      key: "fatherContact",
      width: 15,
      style: { numFmt: "@" },
    },
    { header: "Father's Email", key: "fatherEmail", width: 30 },
    { header: "Mother's Name", key: "motherName", width: 20 },
    {
      header: "Mother's Contact",
      key: "motherContact",
      width: 15,
      style: { numFmt: "@" },
    },
    { header: "Mother's Email", key: "motherEmail", width: 30 },
    { header: "Emergency Contact Name", key: "emergencyName", width: 20 },
    {
      header: "Emergency Contact Number",
      key: "emergencyNumber",
      width: 15,
      style: { numFmt: "@" },
    },
    { header: "Emergency Contact Email", key: "emergencyEmail", width: 30 },
  ];

  // Add rows
  selectedStudents.forEach((student) => {
    const studentDetails =
      student.appliedCohorts?.[student.appliedCohorts.length - 1]
        ?.applicationDetails?.studentDetails;

    worksheet.addRow({
      name: `${student?.firstName || ""} ${student?.lastName || ""}`.trim(),
      email: student?.email || "",
      phone: student?.mobileNumber || "",
      address: `${studentDetails?.currentAddress?.streetAddress || ""} ${
        studentDetails?.currentAddress?.city || ""
      } ${studentDetails?.currentAddress?.state || ""} ${
        studentDetails?.currentAddress?.postalCode || ""
      }`.trim(),
      fatherName: `${
        studentDetails?.parentInformation?.father?.firstName || ""
      } ${studentDetails?.parentInformation?.father?.lastName || ""}`.trim(),
      fatherContact:
        studentDetails?.parentInformation?.father?.contactNumber || "",
      fatherEmail: studentDetails?.parentInformation?.father?.email || "",
      motherName: `${
        studentDetails?.parentInformation?.mother?.firstName || ""
      } ${studentDetails?.parentInformation?.mother?.lastName || ""}`.trim(),
      motherContact:
        studentDetails?.parentInformation?.mother?.contactNumber || "",
      motherEmail: studentDetails?.parentInformation?.mother?.email || "",
      emergencyName: `${studentDetails?.emergencyContact?.firstName || ""} ${
        studentDetails?.emergencyContact?.lastName || ""
      }`.trim(),
      emergencyNumber: studentDetails?.emergencyContact?.contactNumber || "",
      emergencyEmail: studentDetails?.emergencyContact?.email || "",
    });
  });

  // Force all phone number columns to be text format
  ["phone", "fatherContact", "motherContact", "emergencyNumber"].forEach(
    (column) => {
      worksheet
        .getColumn(column)
        .eachCell({ includeEmpty: false }, (cell: { numFmt: string }) => {
          cell.numFmt = "@";
        });
    }
  );

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create blob and download
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "students_export.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
