"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";

const PRIVATE_ROUTES = ["/profile", "/notes"];

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
        const isSessionValid = await checkSession();

        if (!isSessionValid) {
          throw new Error("Session is not valid");
        }

        const user = await getMe();

        if (!cancelled) {
          setUser(user);
          setAuthorized(true);
        }
      } catch {
        if (!cancelled) {
          try {
            await logout();
          } catch {}
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