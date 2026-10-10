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

function cleanString(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
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

        const customers = await db
            .collection<CustomerDocument>("customers")
            .find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ customers });
    } catch (error) {
        console.error("Unable to retrieve customers:", error);

        return NextResponse.json(
            { message: "Unable to retrieve customers." },
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

        const now = new Date();

        const customer: CustomerDocument = {
            userId: session.user.id,
            name,
            ...(email ? { email } : {}),
            ...(phone ? { phone } : {}),
            ...(notes ? { notes } : {}),
            createdAt: now,
            updatedAt: now,
        };

        const db = await getDatabase();

        const result = await db
            .collection<CustomerDocument>("customers")
            .insertOne(customer);

        return NextResponse.json(
            {
                message: "Customer created successfully.",
                customer: {
                    ...customer,
                    _id: result.insertedId.toString(),
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Unable to create customer:", error);

        return NextResponse.json(
            { message: "Unable to create customer." },
            { status: 500 },
        );
    }
}