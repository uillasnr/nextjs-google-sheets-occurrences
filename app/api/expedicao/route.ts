import { NextResponse } from "next/server";
import { ExpedicaoService } from "@/app/services/googleSheets/ExpedicaoService";

export async function GET() {
  const dados = await ExpedicaoService.listar();
  return NextResponse.json(dados);
}

export async function POST(request: Request) {
  const body = await request.json();
  const registro = await ExpedicaoService.criar(body);
  return NextResponse.json(registro);
}
