import { NextResponse } from "next/server";
import { verifyToken } from "../../../lib/auth";
import { prisma } from "@repo/db/client";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const { employeeId } = verifyToken(token);

    const { type } = await req.json();
    if (type !== "IN" && type !== "OUT") {
      return NextResponse.json(
        { error: 'type must be "IN" or "OUT"' },
        { status: 400 }
      );
    }

    await prisma.attendance.create({
      data: { employeeId, type }, // timestamp defaults to now()
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Unauthorized or invalid request" },
      { status: 401 }
    );
  }
}
