export const formatAmount = (value: number | undefined) =>
  value !== undefined
    ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        Math.round(value)
      )
    : "--";

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
