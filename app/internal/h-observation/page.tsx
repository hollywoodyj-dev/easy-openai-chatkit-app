import { redirect } from "next/navigation";

export default function HObservationIndexPage() {
  redirect("/internal/h-observation/queue");
}
