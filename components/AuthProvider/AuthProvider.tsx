"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getCurrentUser, logoutUser } from "@/lib/api/clientApi";

const PRIVATE_ROUTES = ["/profile"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const isPrivate = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
  console.log("pathname:", pathname);
  console.log("isPrivate:", isPrivate);
  // ...
}, [pathname]);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      if (!isPrivate) {
        setLoading(false);
        setAuthorized(true);
        return;
      }

      setLoading(true);
      setAuthorized(false);

      try {
        const user = await getCurrentUser();

        if (!cancelled) {
          setUser(user);
          setAuthorized(true);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          if (error instanceof Error) {
            console.error("Auth check failed:", error.message);
          }

          try {
            await logoutUser();
          } catch {
            // logout може падати якщо cookie вже немає — ігноруємо
          }

          clearIsAuthenticated();
          setAuthorized(false);
          router.replace("/sign-in");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname, isPrivate, setUser, clearIsAuthenticated, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isPrivate && !authorized) {
    return null;
  }

  return <>{children}</>;
}

