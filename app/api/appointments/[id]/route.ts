import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDatabase } from "@/lib/mongodb";

type AppointmentStatus = "scheduled" | "completed" | "cancelled";

interface AppointmentDocument {
  userId: string;
  customerId: ObjectId;
  title: string;
  scheduledAt: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AppointmentRouteContext {
  params: Promise<{ id: string }>;
}

function isAppointmentStatus(value: unknown): value is AppointmentStatus {
  return (
    value === "scheduled" ||
    value === "completed" ||
    value === "cancelled"
  );
}

export async function PATCH(
  request: Request,
  context: AppointmentRouteContext,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Authentication is required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid appointment ID." },
      { status: 400 },
    );
  }

  try {
    const body: unknown = await request.json();

    const data =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : {};

    if (!isAppointmentStatus(data.status)) {
      return NextResponse.json(
        {
          message:
            "Status must be scheduled, completed, or cancelled.",
        },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const appointments = db.collection<AppointmentDocument>("appointments");
    const appointmentId = new ObjectId(id);

    const updateResult = await appointments.updateOne(
      {
        _id: appointmentId,
        userId: session.user.id,
      },
      {
        $set: {
          status: data.status,
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 },
      );
    }

    const appointment = await appointments.findOne({
      _id: appointmentId,
      userId: session.user.id,
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Appointment status updated successfully.",
      appointment: {
        ...appointment,
        _id: appointment._id.toString(),
        customerId: appointment.customerId.toString(),
      },
    });
  } catch (error) {
    console.error("Unable to update appointment status:", error);

    return NextResponse.json(
      { message: "Unable to update appointment status." },
      { status: 500 },
    );
  }
}