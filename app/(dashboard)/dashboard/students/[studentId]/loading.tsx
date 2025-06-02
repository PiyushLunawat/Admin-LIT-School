import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <LoaderIcon className="w-8 h-8 animate-spin" />
    </div>
  );
}
