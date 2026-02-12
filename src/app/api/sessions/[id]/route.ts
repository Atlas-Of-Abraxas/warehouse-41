import { prisma } from "@/lib/db";
import { validateSession } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(session);
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

  const validation = validateSession(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const session = await prisma.session.update({
    where: { id },
    data: {
      title: body.title as string,
      description: body.description as string,
      gameSystem: body.gameSystem as string,
      gmName: body.gmName as string,
      date: new Date(body.date as string),
      duration: typeof body.duration === "number" ? body.duration : undefined,
      price: typeof body.price === "number" ? body.price : undefined,
      maxPlayers: body.maxPlayers as number,
      image: (body.image as string) || undefined,
    },
  });

  return NextResponse.json(session);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.session.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
