// import React, { useState, useEffect, useRef } from "react";
// import "./FileUpload.css";

// const baseUrl = "http://localhost:4000/student";
// const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunk size
// const MAX_CONCURRENT_UPLOADS = 4; // Number of parallel uploads

// const storage = {
//   get: (key) => JSON.parse(localStorage.getItem(key)),
//   set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
//   remove: (key) => localStorage.removeItem(key),
// };

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [totalChunks, setTotalChunks] = useState(0);
//   const [uploadId, setUploadId] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [uploadedChunks, setUploadedChunks] = useState([]);
//   const [fileUrl, setFileUrl] = useState("");
//   const fileInputRef = useRef(null);
//   const activeRequests = useRef(new Set());
//   const uploadedChunksCount = useRef(0);
//   const retryAttempts = useRef(new Map());

//   const [config, setConfig] = useState({
//     maxRetries: 3,
//     retryDelay: 2000,
//     autoResume: true,
//   });

//   // Network status detection with event listeners
//   useEffect(() => {
//     let isMounted = true;

//     const handleOnline = () => {
//       if (!isMounted) return;
//       setIsOnline(true);
//       console.log("Network connection restored");

//       if (
//         config.autoResume &&
//         uploadId &&
//         !isUploading &&
//         file &&
//         uploadedChunks.length < totalChunks
//       ) {
//         console.log("Attempting to auto-resume upload...");
//         handleUpload();
//       }
//     };

//     const handleOffline = () => {
//       if (!isMounted) return;
//       setIsOnline(false);
//       console.log("Network connection lost");
//     };

//     setIsOnline(navigator.onLine);
//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     return () => {
//       isMounted = false;
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, [
//     config.autoResume,
//     uploadId,
//     isUploading,
//     file,
//     uploadedChunks,
//     totalChunks,
//   ]);

//   // Load saved state on component mount
//   useEffect(() => {
//     const savedState = storage.get("fileUploadState");
//     if (savedState) {
//       setFileName(savedState.fileName);
//       setTotalChunks(savedState.totalChunks);
//       setUploadId(savedState.uploadId);
//       setUploadedChunks(savedState.uploadedChunks || []);
//       uploadedChunksCount.current = savedState.uploadedChunks?.length || 0;
//       setProgress(savedState.progress || 0);
//       setFileUrl(savedState.fileUrl || "");

//       if (savedState.fileName && !file) {
//         setUploadStatus(
//           "Upload in progress - please select the same file to resume"
//         );
//       }
//     }
//     return () => {
//       abortAllRequests();
//     };
//   }, []);

//   const abortAllRequests = () => {
//     activeRequests.current.forEach((controller) => controller.abort());
//     activeRequests.current.clear();
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       resetUploadState();
//       setFile(selectedFile);
//       setFileName(Date.now().toString() + "_" + selectedFile.name);
//       setTotalChunks(Math.ceil(selectedFile.size / CHUNK_SIZE));
//     }
//   };

//   const resetUploadState = () => {
//     setProgress(0);
//     uploadedChunksCount.current = 0;
//     setUploadStatus("");
//     setUploadedChunks([]);
//     setUploadId("");
//     setFileUrl("");
//     retryAttempts.current = new Map();
//     storage.remove("fileUploadState");
//   };

//   const saveUploadState = () => {
//     storage.set("fileUploadState", {
//       fileName,
//       totalChunks,
//       uploadId,
//       uploadedChunks,
//       progress,
//       fileUrl, // Save fileUrl in local storage
//     });
//   };

//   const updateProgress = () => {
//     const newProgress = Math.floor(
//       (uploadedChunksCount.current / totalChunks) * 100
//     );
//     setProgress(newProgress);
//     saveUploadState();
//   };

//   const uploadChunk = async (chunk, index, currentUploadId, signal) => {
//     const formData = new FormData();
//     formData.append("index", index);
//     formData.append("totalChunks", totalChunks);
//     formData.append("fileName", fileName);
//     formData.append("file", chunk);

//     let controller;

//     try {
//       controller = new AbortController();
//       activeRequests.current.add(controller);
//       if (signal) {
//         signal.addEventListener("abort", () => controller.abort());
//       }

//       const response = await fetch(
//         `${baseUrl}/upload?uploadId=${currentUploadId}`,
//         {
//           method: "POST",
//           body: formData,
//           signal: controller.signal,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Upload failed for chunk ${index}`);
//       }

//       setUploadedChunks((prev) => [...prev, index]);
//       uploadedChunksCount.current += 1;
//       retryAttempts.current.delete(index);
//       updateProgress();
//       return true;
//     } catch (error) {
//       if (error.name !== "AbortError") {
//         console.error(`Error uploading chunk ${index}:`, error);
//         const attempts = (retryAttempts.current.get(index) || 0) + 1;
//         retryAttempts.current.set(index, attempts);
//       }
//       return false;
//     } finally {
//       if (controller) {
//         activeRequests.current.delete(controller);
//       }
//     }
//   };

//   const processChunksInParallel = async (chunkIndexes, currentUploadId) => {
//     const queue = [...chunkIndexes];
//     const results = {};
//     const abortController = new AbortController();

//     chunkIndexes.forEach((index) => {
//       results[index] = false;
//     });

//     const worker = async () => {
//       while (queue.length > 0 && !abortController.signal.aborted) {
//         const index = queue.shift();
//         if (index === undefined) continue;

//         const attempts = retryAttempts.current.get(index) || 0;
//         if (attempts > config.maxRetries) {
//           results[index] = false;
//           continue;
//         }

//         if (attempts > 0) {
//           await new Promise((resolve) =>
//             setTimeout(resolve, config.retryDelay)
//           );
//         }

//         const start = index * CHUNK_SIZE;
//         const end = start + CHUNK_SIZE;
//         const chunk = file.slice(start, end);

//         results[index] = await uploadChunk(
//           chunk,
//           index,
//           currentUploadId,
//           abortController.signal
//         );
//       }
//     };

//     const workers = Array(Math.min(MAX_CONCURRENT_UPLOADS, chunkIndexes.length))
//       .fill(null)
//       .map(worker);

//     await Promise.all(workers);
//     return chunkIndexes.map((index) => results[index]);
//   };

//   const handleUpload = async () => {
//     if (isUploading || !file) return;
//     if (!isOnline) {
//       setUploadStatus("Waiting for network connection...");
//       return;
//     }

//     setIsUploading(true);
//     setUploadStatus("Uploading...");
//     setFileUrl("");

//     const startTime = new Date();
//     let currentUploadId = uploadId;

//     try {
//       if (!currentUploadId) {
//         const requestBody = { fileName };
//         const res = await fetch(`${baseUrl}/initiateUpload`, {
//           method: "POST",
//           body: JSON.stringify(requestBody),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!res.ok) throw new Error("Failed to initiate upload");

//         const data = await res.json();
//         currentUploadId = data.uploadId;
//         setUploadId(currentUploadId);
//         saveUploadState();
//       }

//       setUploadStatus("Verifying uploaded chunks...");
//       const statusRes = await fetch(
//        `${baseUrl}/uploadStatus?uploadId=${currentUploadId}&fileName=${fileName}`
//       );
//       const statusData = await statusRes.json();

//       if (statusData.exists) {
//         setUploadedChunks(statusData.uploadedChunks || []);
//         uploadedChunksCount.current = statusData.uploadedChunks?.length || 0;
//         updateProgress();
//       }

//       const chunksToUpload = [];
//       for (let i = 0; i < totalChunks; i++) {
//         if (!uploadedChunks.includes(i)) {
//           const attempts = retryAttempts.current.get(i) || 0;
//           if (attempts <= config.maxRetries) {
//             chunksToUpload.push(i);
//           }
//         }
//       }

//       setUploadStatus(`Uploading ${chunksToUpload.length} remaining chunks...`);
//       const uploadResults = await processChunksInParallel(
//         chunksToUpload,
//         currentUploadId
//       );

//       const failedChunks = chunksToUpload.filter((_, i) => !uploadResults[i]);
//       if (failedChunks.length > 0) {
//         const failedCounts = failedChunks.map(
//           (index) => retryAttempts.current.get(index) || 1
//         );
//         setUploadStatus(
//           `Failed to upload ${failedChunks.length} chunks after retries. ` +
//             `Retry counts: ${failedCounts.join(", ")}`
//         );
//         throw new Error(
//           `Upload incomplete - ${failedChunks.length} chunks failed after maximum retries`
//         );
//       }

//       setUploadStatus("Final verification before completion...");
//       const verifyRes = await fetch(
//         `${baseUrl}/verify-upload?uploadId=${currentUploadId}&fileName=${fileName}`
//       );
//       const verifyData = await verifyRes.json();

//       if (!verifyData.valid) {
//         throw new Error(
//           "Upload verification failed - some chunks may be missing"
//         );
//       }

//       const completeRes = await fetch(
//         `${baseUrl}/completeUpload?fileName=${fileName}&uploadId=${currentUploadId}`,
//         { method: "POST" }
//       );

//       if (!completeRes.ok) throw new Error("Error completing upload");

//       const completeData = await completeRes.json();
//       if (!completeData.success) throw new Error("Error completing upload");

//       const endTime = new Date();
//       const timeElapsed = (endTime.getTime() - startTime.getTime()) / 1000;

//       setFileUrl(completeData.s3Url || completeData.location);
//       setUploadStatus(
//         `File uploaded successfully in ${timeElapsed.toFixed(2)}s!`
//       );

//       // Save the state with the fileUrl
//       saveUploadState();
//     } catch (err) {
//       console.error("Upload error:", err);
//       setUploadStatus(`Error: ${err.message}`);
//       saveUploadState();
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!fileUrl || !fileName) return;

//     try {
//       setUploadStatus("Deleting file...");
//       const response = await fetch(
//         `${baseUrl}/deleteFile?fileName=${encodeURIComponent(fileName)}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Delete failed");
//       }

//       const result = await response.json();
//       if (result.success) {
//         resetUploadState();
//         setUploadStatus("File deleted successfully");
//       } else {
//         throw new Error(result.message || "Delete failed");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       setUploadStatus(`Delete failed: ${error.message}`);
//     }
//   };

//   const handleConfigChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setConfig((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : Number(value),
//     }));
//   };

//   const resetUpload = () => {
//     abortAllRequests();
//     setFile(null);
//     setFileName("");
//     setTotalChunks(0);
//     setUploadId("");
//     setProgress(0);
//     uploadedChunksCount.current = 0;
//     setUploadedChunks([]);
//     setFileUrl("");
//     retryAttempts.current = new Map();
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//     storage.remove("fileUploadState");
//   };

//   return (
//     <div className="file-upload-container">
//       <h2>Advanced File Upload</h2>

//       <div className="config-panel">
//         <h3>Upload Configuration</h3>
//         <div className="config-item">
//           <label>Max Retries:</label>
//           <input
//             type="number"
//             name="maxRetries"
//             min="0"
//             max="10"
//             value={config.maxRetries}
//             onChange={handleConfigChange}
//           />
//         </div>
//         <div className="config-item">
//           <label>Retry Delay (ms):</label>
//           <input
//             type="number"
//             name="retryDelay"
//             min="0"
//             max="10000"
//             value={config.retryDelay}
//             onChange={handleConfigChange}
//           />
//         </div>
//         <div className="config-item">
//           <label>
//             <input
//               type="checkbox"
//               name="autoResume"
//               checked={config.autoResume}
//               onChange={handleConfigChange}
//             />
//             Auto-resume on reconnect
//           </label>
//         </div>
//       </div>

//       <div className="network-status">
//         <span
//           className={network-indicator ${isOnline ? "online" : "offline"}}
//         >
//           {isOnline ? "🟢 Online" : "🔴 Offline"}
//         </span>
//       </div>

//       <div className="upload-controls">
//         <input
//           type="file"
//           id="fileInput"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           disabled={isUploading}
//         />
//         <button
//           onClick={handleUpload}
//           disabled={isUploading || !file || !isOnline}
//         >
//           {isUploading
//             ? "Uploading..."
//             : uploadedChunks.length > 0
//             ? "Resume Upload"
//             : "Upload"}
//         </button>
//         <button onClick={resetUpload} disabled={isUploading}>
//           Reset
//         </button>
//       </div>

//       {uploadId && (
//         <div className="resume-info">
//           <p>Upload ID: {uploadId}</p>
//           <p>
//             Progress: {uploadedChunks.length}/{totalChunks} chunks uploaded
//           </p>
//           {!isOnline && config.autoResume && uploadedChunks.length > 0 && (
//             <p className="warning">
//               ⏳ Upload paused - will auto-resume when online
//             </p>
//           )}
//         </div>
//       )}

//       <div className="progress-container">
//         <div className="progress-bar" style={{ width: ${progress}% }}>
//           {progress}%
//         </div>
//       </div>

//       <div className="upload-status">
//         {uploadStatus && <p>{uploadStatus}</p>}
//         {fileUrl && (
//           <div className="file-url-container">
//             <p className="file-url-label">File available at:</p>
//             <a
//               href={fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="file-url"
//             >
//               {fileUrl}
//             </a>
//             <button
//               onClick={handleDelete}
//               disabled={isUploading}
//               className="delete-button"
//             >
//               Delete File
//             </button>
//           </div>
//         )}
//         {Array.from(retryAttempts.current.entries())
//           .filter(([_, attempts]) => attempts >= config.maxRetries)
//           .map(([index, attempts]) => (
//             <p key={index} className="error">
//               ❌ Chunk {index} failed after {attempts} attempts
//             </p>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;