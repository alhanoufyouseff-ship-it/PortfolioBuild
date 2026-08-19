import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: { username: string } }) {
  try {
    const db = getAdminDb();
    const snap = await db.collection('portfolios').doc(params.username).get();

    if (!snap.exists) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على البورتفوليو' }, { status: 404 });
    }

    return NextResponse.json({ success: true, portfolio: snap.data() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
