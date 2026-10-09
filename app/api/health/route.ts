import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });

    return NextResponse.json({
      status: "ok",
      database: db.databaseName,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      { status: "error", message: "Database connection failed." },
      { status: 500 },
    );
  }
}