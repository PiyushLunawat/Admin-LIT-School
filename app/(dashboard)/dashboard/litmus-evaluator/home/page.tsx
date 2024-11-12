import { redirect } from "next/navigation";

export default function LitmusHomePage() {
  redirect("/dashboard/litmus-evaluator");
}