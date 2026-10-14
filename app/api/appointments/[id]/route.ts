import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDatabase } from "@/lib/mongodb";

type AppointmentStatus = "scheduled" | "completed" | "cancelled";

interface CustomerDocument {
  userId: string;
  name: string;
}

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

export async function GET(
  _request: Request,
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
    const db = await getDatabase();
    const appointments = db.collection<AppointmentDocument>("appointments");

    const appointment = await appointments.findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      appointment: {
        ...appointment,
        _id: appointment._id.toString(),
        customerId: appointment.customerId.toString(),
      },
    });
  } catch (error) {
    console.error("Unable to load appointment:", error);

    return NextResponse.json(
      { message: "Unable to load appointment." },
      { status: 500 },
    );
  }
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

    const update: Partial<
      Pick<
        AppointmentDocument,
        "customerId" | "title" | "scheduledAt" | "status" | "notes"
      >
    > = {};

    if (data.customerId !== undefined) {
      if (
        typeof data.customerId !== "string" ||
        !ObjectId.isValid(data.customerId)
      ) {
        return NextResponse.json(
          { message: "Please provide a valid customer." },
          { status: 400 },
        );
      }

      const db = await getDatabase();
      const customer = await db
        .collection<CustomerDocument>("customers")
        .findOne({
          _id: new ObjectId(data.customerId),
          userId: session.user.id,
        });

      if (!customer) {
        return NextResponse.json(
          { message: "Customer not found." },
          { status: 404 },
        );
      }

      update.customerId = new ObjectId(data.customerId);
    }

    if (data.title !== undefined) {
      if (
        typeof data.title !== "string" ||
        data.title.trim().length === 0 ||
        data.title.trim().length > 120
      ) {
        return NextResponse.json(
          { message: "Title must contain between 1 and 120 characters." },
          { status: 400 },
        );
      }

      update.title = data.title.trim();
    }

    if (data.scheduledAt !== undefined) {
      if (
        typeof data.scheduledAt !== "string" ||
        data.scheduledAt.trim().length === 0
      ) {
        return NextResponse.json(
          { message: "Please provide an appointment date and time." },
          { status: 400 },
        );
      }

      const scheduledAt = new Date(data.scheduledAt);

      if (Number.isNaN(scheduledAt.getTime())) {
        return NextResponse.json(
          { message: "Please provide a valid appointment date and time." },
          { status: 400 },
        );
      }

      update.scheduledAt = scheduledAt;
    }

    if (data.status !== undefined) {
      if (!isAppointmentStatus(data.status)) {
        return NextResponse.json(
          {
            message: "Status must be scheduled, completed, or cancelled.",
          },
          { status: 400 },
        );
      }

      update.status = data.status;
    }

    if (data.notes !== undefined) {
      if (typeof data.notes !== "string" || data.notes.length > 1000) {
        return NextResponse.json(
          { message: "Notes must contain no more than 1000 characters." },
          { status: 400 },
        );
      }

      update.notes = data.notes.trim();
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { message: "Provide at least one valid field to update." },
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
          ...update,
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
      message: "Appointment updated successfully.",
      appointment: {
        ...appointment,
        _id: appointment._id.toString(),
        customerId: appointment.customerId.toString(),
      },
    });
  } catch (error) {
    console.error("Unable to update appointment:", error);

    return NextResponse.json(
      { message: "Unable to update appointment." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
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
    const db = await getDatabase();
    const appointments = db.collection<AppointmentDocument>("appointments");

    const deleteResult = await appointments.deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Appointment not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Appointment deleted successfully.",
    });
  } catch (error) {
    console.error("Unable to delete appointment:", error);

    return NextResponse.json(
      { message: "Unable to delete appointment." },
      { status: 500 },
    );
  }
}