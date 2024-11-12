import { redirect } from "next/navigation";

export default function LitmusSettingsPage() {
  redirect("/dashboard/litmus-evaluator");
}