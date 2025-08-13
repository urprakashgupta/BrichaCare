import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";

import { prisma } from "@repo/db/client";

export async function POST(req: Request) {
  try {
    const { employeeId, password } = await req.json();

    if (!employeeId || !password) {
      return NextResponse.json(
        { error: "employeeId and password required" },
        { status: 400 }
      );
    }

    const user = await prisma.employee.findUnique({ where: { employeeId } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({ employeeId: user.employeeId });
    return NextResponse.json({ token });
  } catch (e) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
