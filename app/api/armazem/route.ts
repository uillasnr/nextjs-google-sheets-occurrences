import { NextResponse } from "next/server";
import { ArmazemSheetsService } from "@/app/services/googleSheets/ArmazemSheetsService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filial = searchParams.get("sheet") || "SP";

    const notas = await ArmazemSheetsService.getNotas(filial);

    return NextResponse.json(notas);
  } catch (error) {
    console.error("Erro ao buscar notas do armazém:", error);
    return NextResponse.json(
      { error: "Erro ao buscar notas do armazém" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filial = searchParams.get("sheet") || "SP";
    const body = await request.json();

    const nota = await ArmazemSheetsService.createNota(filial, body);

    return NextResponse.json(nota, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar nota do armazém:", error);
    return NextResponse.json(
      { error: "Erro ao criar nota do armazém" },
      { status: 500 }
    );
  }
}
