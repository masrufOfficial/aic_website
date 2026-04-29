import { getCurrentApiUser } from "@/lib/auth";
import { getContentMap } from "@/lib/content";
import { NavbarClient } from "@/components/site/navbar-client";

export default async function Navbar() {
  const [user, content] = await Promise.all([getCurrentApiUser(), getContentMap()]);

  return (
    <NavbarClient
      content={content}
      isAdmin={user?.role === "admin"}
      isLoggedIn={Boolean(user)}
      user={
        user
          ? {
              name: user.name,
              image: user.image ?? user.profileImage ?? null,
            }
          : null
      }
    />
  );
}
