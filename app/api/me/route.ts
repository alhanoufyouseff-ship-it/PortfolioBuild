import { NextResponse } from 'next/server';
import { AuthError, getAdminDb, requireAuthedUid } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const uid = await requireAuthedUid(request);
    const db = getAdminDb();
    const userSnap = await db.collection('users').doc(uid).get();
    const username = userSnap.exists ? (userSnap.data()?.username as string | undefined) : undefined;

    if (!username) {
      return NextResponse.json({ success: true, portfolio: null });
    }

    const portfolioSnap = await db.collection('portfolios').doc(username).get();
    return NextResponse.json({ success: true, portfolio: portfolioSnap.exists ? portfolioSnap.data() : null });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
