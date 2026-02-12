import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { currentPassword, newEmail, newPassword } = body;

  if (!currentPassword) {
    return NextResponse.json(
      { error: "Current password is required" },
      { status: 400 }
    );
  }

  // Find the admin user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify current password
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 403 }
    );
  }

  // Build update data
  const updateData: { email?: string; password?: string } = {};

  if (newEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    // Check if email is already taken
    const existing = await prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (existing && existing.id !== user.id) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }
    updateData.email = newEmail;
  }

  if (newPassword) {
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No changes provided" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  return NextResponse.json({ success: true });
}
