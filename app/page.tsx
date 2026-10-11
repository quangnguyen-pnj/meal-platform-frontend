import { redirect } from "next/navigation";

/** Root chi dieu huong vao shell bao ve; gating phien o (protected)/layout. */
export default function HomePage() {
  redirect("/dashboard");
}
