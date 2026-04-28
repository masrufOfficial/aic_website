import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { getContentMap } from "@/lib/content";
import { NavbarClient } from "@/components/site/navbar-client";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bubt_ai_session")?.value;

  const session = token ? await verifyAuthToken(token) : null;
  const content = await getContentMap();

  return (
    <NavbarClient
      content={content}
      isAdmin={session?.role === "admin"}
      isLoggedIn={Boolean(session)}
    />
  );
}