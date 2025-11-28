import { NextResponse } from "next/server";
import {signOut} from "../../../../../auth.ts"

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.set("token", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    });

    const res = await signOut({
      redirect: false,
    })

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
