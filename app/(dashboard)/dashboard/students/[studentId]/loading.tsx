import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <LoaderCircle className="w-8 h-8 animate-spin" />
    </div>
  );
}
