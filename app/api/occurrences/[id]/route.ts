import { NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/googleSheets';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const occurrence = await GoogleSheetsService.updateOccurrence(params.id, body);
    return NextResponse.json(occurrence);
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
  try {
    await GoogleSheetsService.deleteOccurrence(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar ocorrência' },
      { status: 500 }
    );
  }
}
