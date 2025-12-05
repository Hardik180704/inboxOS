import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { _accountId } = await request.json()

  try {
    // TODO: Implement sync logic
    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
