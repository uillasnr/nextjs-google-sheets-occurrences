import { GoogleSheetsService } from '@/app/services/googleSheets/GoogleSheetsService';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sheet = searchParams.get('sheet') || 'SP'; // default

    const occurrences = await GoogleSheetsService.getOccurrences(sheet);

    return NextResponse.json(occurrences);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar ocorrências' },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
   const { searchParams } = new URL(request.url);
  const sheet = searchParams.get('sheet') || 'SP';

  const body = await request.json();
  const occurrence = await GoogleSheetsService.createOccurrence(sheet, body);

  return NextResponse.json(occurrence, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ocorrência' },
      { status: 500 }
    );
  }
}
