import { NextResponse } from "next/server";
import { ExpedicaoService } from "@/app/services/googleSheets/ExpedicaoService";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const atualizado = await ExpedicaoService.expedir(params.id, body);
  return NextResponse.json(atualizado);
}
