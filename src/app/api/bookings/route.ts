import { prisma } from "@/lib/db";
import { validateBooking } from "@/lib/validate";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { session: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validation = validateBooking(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const sessionId = body.sessionId as string;
  const customerName = body.customerName as string;
  const customerEmail = body.customerEmail as string;
  const seats = (body.seats as number) || 1;

  // Atomic check-and-book using a transaction to prevent race conditions
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const session = await tx.session.findUnique({ where: { id: sessionId } });
      if (!session) {
        throw new Error("Session not found");
      }

      const spotsLeft = session.maxPlayers - session.currentPlayers;
      if (seats > spotsLeft) {
        throw new Error("Not enough spots available");
      }

      await tx.session.update({
        where: { id: sessionId },
        data: { currentPlayers: { increment: seats } },
      });

      return tx.booking.create({
        data: {
          sessionId,
          customerName,
          customerEmail,
          seats,
          paymentStatus: "pending",
        },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Booking failed";
    const status = message === "Session not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
