import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

function parseSetCookie(cookieStr: string) {
  const parts = cookieStr.split(";").map((p) => p.trim());
  const [nameValue, ...attributes] = parts;
  const [name, ...valueParts] = nameValue.split("=");
  const value = valueParts.join("=");

  const options: {
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    maxAge?: number;
    expires?: Date;
    sameSite?: "lax" | "strict" | "none";
  } = {};

  for (const attr of attributes) {
    const lower = attr.toLowerCase();

    if (lower === "httponly") {
      options.httpOnly = true;
    } else if (lower === "secure") {
      options.secure = true;
    } else if (lower.startsWith("path=")) {
      options.path = attr.split("=")[1];
    } else if (lower.startsWith("max-age=")) {
      options.maxAge = Number(attr.split("=")[1]);
    } else if (lower.startsWith("expires=")) {
      options.expires = new Date(attr.split("=").slice(1).join("="));
    } else if (lower.startsWith("samesite=")) {
      options.sameSite = attr.split("=")[1].toLowerCase() as
        | "lax"
        | "strict"
        | "none";
    }
  }

  return { name: name.trim(), value: value.trim(), options };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("auth/login", body);

    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieStore = await cookies();
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const { name, value, options } = parseSetCookie(cookieStr);

        if (name && value) {
          cookieStore.set(name, value, options);
        }
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    if (apiRes.data?.accessToken) {
      const cookieStore = await cookies();

      cookieStore.set("accessToken", apiRes.data.accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (apiRes.data?.refreshToken) {
        cookieStore.set("refreshToken", apiRes.data.refreshToken, {
          httpOnly: true,
          secure: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    logErrorResponse({ message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}