import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDatabase } from "@/lib/mongodb";

interface CustomerDocument {
  userId: string;
  name: string;
}

interface AppointmentDocument {
  userId: string;
  customerId: ObjectId;
  title: string;
  scheduledAt: Date;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    const db = await getDatabase();

    const appointments = await db
      .collection<AppointmentDocument>("appointments")
      .find({ userId: session.user.id })
      .sort({ scheduledAt: 1 })
      .toArray();

    return NextResponse.json({
      appointments: appointments.map((appointment) => ({
        ...appointment,
        _id: appointment._id.toString(),
        customerId: appointment.customerId.toString(),
      })),
    });
  } catch (error) {
    console.error("Unable to retrieve appointments:", error);

    return NextResponse.json(
      { message: "Unable to retrieve appointments." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Authentication is required." },
      { status: 401 },
    );
  }

  try {
    const body: unknown = await request.json();

    const data =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : {};

    const customerIdValue = cleanString(data.customerId);
    const title = cleanString(data.title);
    const scheduledAt = parseDate(data.scheduledAt);
    const notes = cleanString(data.notes);

    if (!customerIdValue || !ObjectId.isValid(customerIdValue)) {
      return NextResponse.json(
        { message: "A valid customer is required." },
        { status: 400 },
      );
    }

    if (!title) {
      return NextResponse.json(
        { message: "Appointment title is required." },
        { status: 400 },
      );
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { message: "A valid appointment date and time is required." },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const customerId = new ObjectId(customerIdValue);

    const customer = await db
      .collection<CustomerDocument>("customers")
      .findOne({
        _id: customerId,
        userId: session.user.id,
      });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found." },
        { status: 404 },
      );
    }

    const now = new Date();

    const appointment: AppointmentDocument = {
      userId: session.user.id,
      customerId,
      title,
      scheduledAt,
      status: "scheduled",
      ...(notes ? { notes } : {}),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection<AppointmentDocument>("appointments")
      .insertOne(appointment);

    return NextResponse.json(
      {
        message: "Appointment created successfully.",
        appointment: {
          ...appointment,
          _id: result.insertedId.toString(),
          customerId: appointment.customerId.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unable to create appointment:", error);

    return NextResponse.json(
      { message: "Unable to create appointment." },
      { status: 500 },
    );
  }
}