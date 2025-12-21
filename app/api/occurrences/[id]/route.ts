import { GoogleSheetsService } from '@/app/services/googleSheets/GoogleSheetsService';
import { NextResponse } from 'next/server';


export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
   const sheet = new URL(request.url).searchParams.get('sheet') || 'SP';
   await GoogleSheetsService.updateOccurrence(sheet, params.id, await request.json());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar ocorrência' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const sheet = new URL(request.url).searchParams.get('sheet') || 'SP';
await GoogleSheetsService.deleteOccurrence(params.id, sheet);

  return NextResponse.json({ success: true });
}


