// app/api/users/me/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { logErrorResponse } from "../../_utils/utils";
import { isAxiosError } from "axios";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const res = await api.get("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
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

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const res = await api.patch(
      "/users/me",
      { username: body.username },
      {
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(res.data, { status: res.status });
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