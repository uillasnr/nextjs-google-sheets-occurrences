// app/api/transporte/route.ts

import { TransporteSheetsService } from "@/app/services/googleSheets/TransporteSheetsService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await TransporteSheetsService.getBraspres();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("ERRO REAL:", error); // 👈 MOSTRA NO TERMINAL

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
