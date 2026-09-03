import { NextResponse } from "next/server";
import { ArmazemSheetsService } from "@/app/services/googleSheets/ArmazemSheetsService";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ArmazemSheetsService.deleteNota(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao deletar nota do armazém:", error);
    return NextResponse.json(
      { error: "Erro ao deletar nota do armazém" },
      { status: 500 }
    );
  }
}
