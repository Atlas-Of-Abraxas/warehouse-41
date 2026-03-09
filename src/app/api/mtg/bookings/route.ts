import { prisma } from "@/lib/db";
import { validateMTGBooking } from "@/lib/mtg";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const bookings = await prisma.mTGBooking.findMany({
    orderBy: { date: "asc" },
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

  const validation = validateMTGBooking(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const date = new Date(body.date as string);
  const timeSlot = body.timeSlot as string;
  const customerName = body.customerName as string;
  const customerEmail = body.customerEmail as string;

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // One booking per time slot (same date + timeSlot)
      const existing = await tx.mTGBooking.findFirst({
        where: {
          date,
          timeSlot,
          status: { not: "cancelled" },
        },
      });
      if (existing) {
        throw new Error("CONFLICT");
      }

      return tx.mTGBooking.create({
        data: {
          date,
          timeSlot,
          afterHours: false,
          customerName,
          customerEmail,
        },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "CONFLICT") {
      return NextResponse.json(
        { error: "This time slot is already booked for the selected date." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
