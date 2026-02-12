import { prisma } from "@/lib/db";
import { validateEvent } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;

  const events = await prisma.event.findMany({ where, orderBy: { date: "asc" } });
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
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

  const event = await prisma.event.create({
    data: {
      title: body.title as string,
      description: body.description as string,
      date: new Date(body.date as string),
      endDate: body.endDate ? new Date(body.endDate as string) : null,
      type: body.type as string,
      capacity: typeof body.capacity === "number" ? body.capacity : 0,
      price: typeof body.price === "number" ? body.price : 0,
      image: (body.image as string) || "/images/placeholder.jpg",
    },
  });

  return NextResponse.json(event, { status: 201 });
}
