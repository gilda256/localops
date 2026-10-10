import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getDatabase } from "@/lib/mongodb";

interface CustomerDocument {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerRouteContext {
  params: Promise<{ id: string }>;
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function invalidId(id: string): boolean {
  return !ObjectId.isValid(id);
}

export async function PATCH(
  request: Request,
  context: CustomerRouteContext,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Authentication is required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  if (invalidId(id)) {
    return NextResponse.json(
      { message: "Invalid customer ID." },
      { status: 400 },
    );
  }

  try {
    const body: unknown = await request.json();

    const data =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : {};

    const name = cleanString(data.name);
    const email = cleanString(data.email).toLowerCase();
    const phone = cleanString(data.phone);
    const notes = cleanString(data.notes);

    if (!name) {
      return NextResponse.json(
        { message: "Customer name is required." },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const customers = db.collection<CustomerDocument>("customers");
    const customerId = new ObjectId(id);

    const updateResult = await customers.updateOne(
      {
        _id: customerId,
        userId: session.user.id,
      },
      {
        $set: {
          name,
          email,
          phone,
          notes,
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Customer not found." },
        { status: 404 },
      );
    }

    const customer = await customers.findOne({
      _id: customerId,
      userId: session.user.id,
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Customer updated successfully.",
      customer: {
        ...customer,
        _id: customer._id.toString(),
      },
    });
  } catch (error) {
    console.error("Unable to update customer:", error);

    return NextResponse.json(
      { message: "Unable to update customer." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: CustomerRouteContext,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Authentication is required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  if (invalidId(id)) {
    return NextResponse.json(
      { message: "Invalid customer ID." },
      { status: 400 },
    );
  }

  try {
    const db = await getDatabase();

    const result = await db.collection<CustomerDocument>("customers").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Customer not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Customer deleted successfully.",
    });
  } catch (error) {
    console.error("Unable to delete customer:", error);

    return NextResponse.json(
      { message: "Unable to delete customer." },
      { status: 500 },
    );
  }
}