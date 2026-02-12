import { prisma } from "@/lib/db";
import { validateSession } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sessions = await prisma.session.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
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

  const session = await prisma.session.create({
    data: {
      title: body.title as string,
      description: body.description as string,
      gameSystem: body.gameSystem as string,
      gmName: body.gmName as string,
      date: new Date(body.date as string),
      duration: typeof body.duration === "number" ? body.duration : 180,
      price: typeof body.price === "number" ? body.price : 0,
      maxPlayers: body.maxPlayers as number,
      image: (body.image as string) || "/images/placeholder.jpg",
    },
  });

  return NextResponse.json(session, { status: 201 });
}
