import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { accountId } = await request.json();
    // TODO: Implement sync logic
    return NextResponse.json({ success: true, message: 'Sync started' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 });
  }
}
