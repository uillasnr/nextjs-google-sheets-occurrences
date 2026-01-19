import { NextResponse } from "next/server";
import { SaldoSheetsService } from "@/app/services/googleSheets/SaldoSheetsService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ean = searchParams.get("ean"); // 👈 pega o parâmetro da URL

    const data = await SaldoSheetsService.getSaldo();

    // Se tiver EAN, filtra no backend
    const filtered = ean
      ? data.filter((item) => item.EAN13?.toString().includes(ean))
      : [];

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
    return NextResponse.json(
      { error: "Erro ao carregar estoque" },
      { status: 500 }
    );
  }
}
