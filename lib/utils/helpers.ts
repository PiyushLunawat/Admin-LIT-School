export const formatAmount = (value: number | undefined) =>
  value !== undefined
    ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
        Math.round(value)
      )
    : "--";

export const handleFileDownload = async (url: string, fileName: string, fileType: string) => {
    try {
        // 1. Fetch the file as Blob
        const response = await fetch(url);
        const blob = await response.blob();

        // 2. Create a temporary object URL for that Blob
        const blobUrl = URL.createObjectURL(blob);

        // 3. Create a hidden <a> and force download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${fileName}.${fileType}`;  // or "myImage.png"
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error("Download failed", err);
    }
};
      