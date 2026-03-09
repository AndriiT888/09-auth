// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/app/api/api";
import { parse } from "cookie";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ігноруємо системні файли та API маршрути
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Якщо accessToken відсутній, але є refreshToken — спробувати оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const apiRes = await api.get("/auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const setCookie = apiRes.headers["set-cookie"];

      if (setCookie) {
        const response = NextResponse.next();
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path || "/",
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
          };

          if (parsed.accessToken) {
            accessToken = parsed.accessToken;
            response.cookies.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            response.cookies.set("refreshToken", parsed.refreshToken, options);
          }
        }

        // Після оновлення токенів — перевіряємо маршрути
        const isPublic = PUBLIC_ROUTES.some((route) =>
          pathname.startsWith(route)
        );

        if (accessToken && isPublic) {
          const url = request.nextUrl.clone();
          url.pathname = "/";
          const redirectResponse = NextResponse.redirect(url);
          // Переносимо оновлені cookies на redirect response
          for (const cookie of response.cookies.getAll()) {
            redirectResponse.cookies.set(cookie.name, cookie.value);
          }
          return redirectResponse;
        }

        return response;
      }
    } catch {
      // Оновлення сесії не вдалося — користувач неавторизований
      accessToken = undefined;
    }
  }

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  // Неавторизований користувач на приватному маршруті → sign-in
  if (!accessToken && isPrivate) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Авторизований користувач на публічному маршруті → головна сторінка
  if (accessToken && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}