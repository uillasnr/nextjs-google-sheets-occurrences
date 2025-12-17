import { NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/googleSheets';

export async function GET() {
  try {
    const occurrences = await GoogleSheetsService.getOccurrences();
  /*   console.log('Todas as ocorrencias', occurrences); */
    return NextResponse.json(occurrences);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ocorrências' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const occurrence = await GoogleSheetsService.createOccurrence(body);
    console.log('Todas as ocorrencias', occurrence);
    return NextResponse.json(occurrence, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ocorrência' },
      { status: 500 }
    );
  }
}
