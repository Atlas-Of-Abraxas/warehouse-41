import { prisma } from "@/lib/db";
import { validateEvent } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validation = validateEvent(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      title: body.title as string,
      description: body.description as string,
      date: new Date(body.date as string),
      endDate: body.endDate ? new Date(body.endDate as string) : undefined,
      type: body.type as string,
      capacity: typeof body.capacity === "number" ? body.capacity : undefined,
      price: typeof body.price === "number" ? body.price : undefined,
      image: (body.image as string) || undefined,
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
