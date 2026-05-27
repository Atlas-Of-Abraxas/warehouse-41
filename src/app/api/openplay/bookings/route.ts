import { prisma } from "@/lib/db";
import { queueOpenPlayBookingConfirmation } from "@/lib/email";
import { validateOpenPlayBooking } from "@/lib/openplay";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const bookings = await prisma.openPlayBooking.findMany({
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

  const validation = validateOpenPlayBooking(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const date = new Date(body.date as string);
  const timeSlot = body.timeSlot as string;
  const customerName = body.customerName as string;
  const customerEmail = body.customerEmail as string;

  try {
    const booking = await prisma.openPlayBooking.create({
      data: {
        date,
        timeSlot,
        customerName,
        customerEmail,
        status: "confirmed",
      },
    });

    queueOpenPlayBookingConfirmation({
      to: customerEmail,
      customerName,
      date,
      timeSlot,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

// Admin update endpoint for open play bookings
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

  const updated = await prisma.openPlayBooking.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}
