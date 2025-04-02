// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FileIcon, LoaderCircle, XIcon } from "lucide-react";
// import axios from "axios";
// import { Progress } from "@/components/ui/progress";
// import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({
//   region: process.env.NEXT_PUBLIC_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
//     secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
//   },
// });

// const baseUrl = "http://localhost:4000/student";
// const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunk size
// const MAX_CONCURRENT_UPLOADS = 4; // Number of parallel uploads

// const storage = {
//     get: (key: any) => {
//         const item = localStorage.getItem(key);
//         return item ? JSON.parse(item) : null; 
//     },
//     set: (key: any, value: any) => localStorage.setItem(key, JSON.stringify(value)),
//     remove: (key: any) => localStorage.removeItem(key),
// };
  

// interface InternalNotesTabProps {
//   student: any;
//   onApplicationUpdate: () => void;
// }

// export function Trash({ student, onApplicationUpdate }: InternalNotesTabProps) {
//   const [error, setError] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [fileUrl, setFileUrl] = useState("");
  
//   const [file, setFile] = useState<File | null>(null);
//   const [fileName, setFileName] = useState("");
//   const [totalChunks, setTotalChunks] = useState(0);
//   const [uploadId, setUploadId] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [uploadedChunks, setUploadedChunks] = useState<number[]>([]);
  
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

//     // Load saved state on component mount
//     useEffect(() => {
//       const savedState = storage.get("fileUploadState");
//       if (savedState) {
//         setFileName(savedState.fileName);
//         setTotalChunks(savedState.totalChunks);
//         setUploadId(savedState.uploadId);
//         setUploadedChunks(savedState.uploadedChunks || []);
//         uploadedChunksCount.current = savedState.uploadedChunks?.length || 0;
//         setProgress(savedState.progress || 0);
//         setFileUrl(savedState.fileUrl || "");
  
//         if (savedState.fileName && !file) {
//           setUploadStatus(
//             "Upload in progress - please select the same file to resume"
//           );
//         }
//       }
//       return () => {
//         abortAllRequests();
//       };
//     }, []);

//     useEffect(() => {
//         handleUpload();
//       }, [file, fileName]);
  
//     const abortAllRequests = () => {
//       activeRequests.current.forEach((controller: any) => controller.abort());
//       activeRequests.current.clear();
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files || e.target.files.length === 0) return;

//         const selectedFile = e.target.files[0];
//         if (selectedFile) {
//             resetUploadState();
//             setFile(selectedFile);
//             setFileName(generateUniqueFileName(selectedFile.name));
//             setTotalChunks(Math.ceil(selectedFile.size / CHUNK_SIZE));
//         }
//         handleUpload();
//     };

//     const resetUploadState = () => {
//         setProgress(0);
//         uploadedChunksCount.current = 0;
//         setUploadStatus("");
//         setUploadedChunks([]);
//         setUploadId("");
//         setFileUrl("");
//         retryAttempts.current = new Map();
//         storage.remove("fileUploadState");
//     };

//     const saveUploadState = () => {
//         storage.set("fileUploadState", {
//             fileName,
//             totalChunks,
//             uploadId,
//             uploadedChunks,
//             progress,
//             fileUrl, // Save fileUrl in local storage
//         });
//     };

//     const updateProgress = () => {
//         const newProgress = Math.floor(
//           (uploadedChunksCount.current / totalChunks) * 100
//         );
//         setUploadProgress(newProgress);
//         console.log(`Updated progress: ${newProgress}%`);
//     };

// //   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setError(null);
// //     setUploadProgress(0);
  
// //     const selectedFiles = e.target.files;
  
// //     if (!selectedFiles || selectedFiles.length === 0) return;
  
// //     const newFile = selectedFiles[0]; // Rename to avoid confusion
  
// //     if (newFile) {
// //       // Ensure totalChunks is calculated after file selection
// //       setFile(newFile);
// //       const calculatedTotalChunks = Math.ceil(newFile.size / CHUNK_SIZE);
// //       setTotalChunks(calculatedTotalChunks);
// //     }
  
// //     const fileKey = generateUniqueFileName(newFile.name);
// //     setfileName(fileKey);
  
// //     console.log("File selected:", newFile);
// //     e.target.value = "";
  
// //     try {
// //       console.log("Setting uploading state to true...");
// //       setUploading(true);
  
// //       let fileUrl = "";
// //       if (newFile.size <= CHUNK_SIZE) {
// //         console.log("File size is smaller than CHUNK_SIZE, using direct upload.");
// //         fileUrl = await uploadDirect(newFile, fileKey);
// //         console.log("uploadDirect File URL:", fileUrl);
// //       } else {
// //         console.log("File size is larger than CHUNK_SIZE, using multipart upload.");
// //         await handleUpload(fileKey, newFile); // Pass file to ensure it's available
// //       }
  
// //       setFileUrl(fileUrl);
// //     } catch (err: any) {
// //       console.error("Upload error:", err);
// //       setError(err.message || "Error uploading file");
// //     } finally {
// //       console.log("Upload process finished.");
// //       setUploading(false);
// //     }
// //   };  

//   const handleDeleteFile = async (fileUrl: string) => {
//     try {
//       console.log("Deleting file with URL:", fileUrl);
//       const fileKey = fileUrl;
//       if (!fileKey) {
//         console.error("Invalid file URL:", fileUrl);
//         return;
//       }

//       const deleteCommand = new DeleteObjectCommand({
//         Bucket: "dev-application-portal", // Replace with your bucket name
//         Key: fileKey,
//       });

//       console.log("Executing delete command...");
//       await s3Client.send(deleteCommand);
//       console.log("File deleted successfully from S3:", fileUrl);

//       setFileUrl("");
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       setError("Failed to delete file. Try again.");
//     }
//   };

//   const uploadDirect = async (file: File, fileKey: string) => {
//     console.log("Generating presigned URL for direct upload...");
//     const { data } = await axios.post(`${process.env.API_URL}/admin/generate-presigned-url`, {
//       bucketName: "dev-application-portal",
//       key: fileKey,
//     });
//     const { url, key } = data;
//     console.log("Presigned URL received:", url);

//     const partResponse = await axios.put(url, file, {
//       headers: { "Content-Type": file.type },
//       onUploadProgress: (evt: any) => {
//         if (!evt.total) return;
//         const percentComplete = Math.round((evt.loaded / evt.total) * 100);
//         setUploadProgress(percentComplete);
//         console.log(`Upload progress: ${percentComplete}%`);
//       },
//     });

//     return `${url.split("?")[0]}`;
//   };

//   const generateUniqueFileName = (originalName: string) => {
//     const timestamp = Date.now();
//     const sanitizedName = originalName.replace(/\s+/g, '-');
//     return `${timestamp}-${sanitizedName}`;
//   };

//   const processChunksInParallel = async (chunkIndexes: any, currentUploadId: any) => {
//     console.log("Processing chunks in parallel...");
//     const queue = [...chunkIndexes];
//     const results: { [key: number]: boolean } = {};

//     const abortController = new AbortController();

//     chunkIndexes.forEach((index: any) => {
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

//         console.log(`Uploading chunk ${index} of file...`);
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
//     return chunkIndexes.map((index: any) => results[index]);
//   };

//   const uploadChunk = async (chunk: any, index: any, currentUploadId: any, signal: any) => {
//     console.log(`Uploading chunk ${index}...`);
//     const formData = new FormData();
//     formData.append("index", index);
//     formData.append("totalChunks", totalChunks);
//     formData.append("fileName", fileName);
//     formData.append("file", chunk);

//     let controller: AbortController;

//     try {
//       controller = new AbortController();
//       activeRequests.current.add(controller);
//       if (signal) {
//         signal.addEventListener("abort", () => controller.abort());
//       }

//       console.log(`chunk ${index}`,chunk,totalChunks)

//       const response = await fetch(
//         `${baseUrl}/upload?uploadId=${currentUploadId}`,
//         {
//           method: "POST",
//           body: formData,
//           signal: controller.signal,
//         }
//       );
      
//       const responseText = await response.text(); // Get the raw response text
//       console.log('Server Response:', responseText); // Log the response


//       if (!response.ok) {
//         // console.error(`Upload failed for chunk ${index}`);
//         // throw new Error(`Upload failed for chunk ${index}`);
//       }

//       setUploadedChunks((prev) => [...prev, index]);
//       uploadedChunksCount.current += 1;
//       retryAttempts.current.delete(index);
//       updateProgress();
//       console.log(`Chunk ${index} uploaded successfully.`);
//       return true;
//     } catch (error: any) {
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

//   const handleUpload = async () => {
//     console.log("Starting multipart upload...");
    
//     const uploadFile = file;
//     if (!uploadFile) {
//       console.log("No file available for upload.");
//       setUploadStatus("No file selected.");
//       return;
//     }
  
//     if (!isOnline) {
//       setUploadStatus("Waiting for network connection...");
//       console.log("Network connection is offline.");
//       return;
//     }
  
//     console.log("Network is online.");
//     setIsUploading(true);
//     setUploadStatus("Uploading...");
//     setFileUrl("");
  
//     const startTime = new Date();
//     let currentUploadId = uploadId;
  
//     try {
//       console.log("Checking if uploadId exists...");
//       if (!currentUploadId) {
//         const requestBody = { fileName };
//         console.log("Initiating upload...", fileName);
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
//         console.log("Upload initiated, ID:", currentUploadId);
//       }
  
//       console.log("Verifying uploaded chunks...");
//       const statusRes = await fetch(
//         `${baseUrl}/uploadStatus?uploadId=${currentUploadId}&fileName=${fileName}`
//       );
//       const statusData = await statusRes.json();
  
//       if (statusData.exists) {
//         console.log("Found existing uploaded chunks.");
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
  
//       console.log(`Uploading ${chunksToUpload.length} remaining chunks...`);
//       const uploadResults = await processChunksInParallel(chunksToUpload, currentUploadId);
  
//       const failedChunks = chunksToUpload.filter((_, i) => !uploadResults[i]);
//       if (failedChunks.length > 0) {
//         const failedCounts = failedChunks.map(
//           (index) => retryAttempts.current.get(index) || 1
//         );
//         setUploadStatus(
//           `Failed to upload ${failedChunks.length} chunks after retries.  + Retry counts: ${failedCounts.join(", ")}`
//         );
//         console.error(`Upload incomplete - ${failedChunks.length} chunks failed after maximum retries`);
//         throw new Error(
//           `Upload incomplete - ${failedChunks.length} chunks failed after maximum retries`
//         );
//       }
  
//       console.log("Final verification before completion...");
//       const verifyRes = await fetch(
//         `${baseUrl}/verify-upload?uploadId=${currentUploadId}&fileName=${fileName}`
//       );

//       console.log("verify Res", verifyRes);

//       const verifyData = await verifyRes.json();
//       console.log("verify Data", verifyData);
  
//       if (!verifyData.valid) {
//         console.error("Upload verification failed - some chunks may be missing");
//         throw new Error("Upload verification failed - some chunks may be missing");
//       }
  
//       const completeRes = await fetch(
//         `${baseUrl}/completeUpload?fileName=${fileName}&uploadId=${currentUploadId}`,
//         { method: "POST" }
//       );

//       console.log("complete Res", completeRes);
  
//       if (!completeRes.ok) throw new Error("Error completing upload");
  
//       const completeData = await completeRes.json();
//       if (!completeData.success) throw new Error("Error completing upload");
  
//       console.log("complete Data", completeData);

//       const endTime = new Date();
//       const timeElapsed = (endTime.getTime() - startTime.getTime()) / 1000;
  
//       setFileUrl(completeData.s3Url || completeData.location);
//       setUploadStatus(
//         `File uploaded successfully in ${timeElapsed.toFixed(2)}s!`
//       );
//       console.log("Upload complete:", completeData);
//     } catch (err) {
//       console.error("Upload error:", err);
//       setUploadStatus(`Error: ${err}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Add Note</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {isUploading ? (
//             <div className="flex items-center justify-between border rounded-md py-1.5 px-2">
//               <div className="flex items-center gap-2">
//                 <FileIcon className="w-4 h-4" />
//                 <div className="text-sm truncate">{fileName}</div>
//               </div>
//               <div className="flex items-center gap-2">
//                 {progress === 100 ? (
//                   <LoaderCircle className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <>
//                     <Progress className="h-1 w-20" states={[{ value: progress, widt: progress, color: "#2EB88A" }]} />
//                     <span>{progress}%</span>
//                   </>
//                 )}
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="h-7 rounded-full"
//                   onClick={() => handleDeleteFile(fileName)}
//                 >
//                   <XIcon className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-between border rounded-md py-1.5 px-2">
//               <div className="flex items-center gap-2">
//                 <FileIcon className="w-4 h-4" />
//                 <div className="text-sm truncate">{fileUrl}</div>
//               </div>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="h-7 rounded-full"
//                 onClick={() => handleDeleteFile(fileName)}
//               >
//                 <XIcon className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//           <div>
//             <div className="flex gap-2.5">
//               <Button
//                 disabled={isUploading}
//                 type="button"
//                 variant="secondary"
//                 className="flex flex-1 gap-2 items-center"
//                 onClick={() => {
//                   document.getElementById("file-upload")?.click();
//                 }}
//               >
//                 Upload Resource File
//               </Button>
//               <input
//                 type="file"
//                 id="file-upload"
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//               />
//             </div>
//             {error && <p className="text-red-500">{error}</p>}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
