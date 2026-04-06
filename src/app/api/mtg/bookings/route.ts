import { prisma } from "@/lib/db";
import { queueMTGBookingConfirmation } from "@/lib/email";
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
          status: "confirmed",
        },
      });
    });

    queueMTGBookingConfirmation({
      to: customerEmail,
      customerName,
      date,
      timeSlot,
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

// Admin update endpoint for MTG bookings
export async function PUT(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const id = body.id as string | undefined;
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const allowedStatuses = ["confirmed", "cancelled", "no_show"];
  const updateData: Record<string, unknown> = {};

  if (typeof body.status === "string") {
    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updateData.status = body.status;
  }

  if (typeof body.paidInStore === "boolean") {
    updateData.paidInStore = body.paidInStore;
  }

  if (typeof body.notes === "string") {
    updateData.notes = body.notes;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const updated = await prisma.mTGBooking.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}
