import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ORDER_STATUSES = new Set(["pending", "paid", "fulfilled", "cancelled"]);

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { id: true, name: true } } } },
    },
  });

  return NextResponse.json(orders);
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : null;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const data: {
    status?: string;
    posReference?: string | null;
    notes?: string | null;
  } = {};

  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !ORDER_STATUSES.has(body.status)) {
      return NextResponse.json(
        { error: `status must be one of: ${[...ORDER_STATUSES].join(", ")}` },
        { status: 400 }
      );
    }
    data.status = body.status;
  }

  if (body.posReference !== undefined) {
    if (body.posReference !== null && typeof body.posReference !== "string") {
      return NextResponse.json({ error: "posReference must be a string or null" }, { status: 400 });
    }
    data.posReference =
      typeof body.posReference === "string"
        ? body.posReference.trim().slice(0, 200) || null
        : null;
  }

  if (body.notes !== undefined) {
    if (body.notes !== null && typeof body.notes !== "string") {
      return NextResponse.json({ error: "notes must be a string or null" }, { status: 400 });
    }
    data.notes =
      typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) || null : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    await prisma.order.update({
      where: { id },
      data,
    });
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
