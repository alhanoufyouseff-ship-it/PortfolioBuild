import { NextResponse } from 'next/server';
import { AuthError, getAdminDb, requireAuthedUid } from '@/lib/firebase/admin';
import { slugify } from '@/lib/slug';
import type { Portfolio } from '@/lib/types';

export const runtime = 'nodejs';

function sanitizePortfolio(body: Record<string, unknown>): Omit<Portfolio, 'ownerUid' | 'username'> {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);

  return {
    name: str(body.name),
    bio: str(body.bio),
    education: str(body.education),
    skills: str(body.skills),
    email: str(body.email),
    phone: str(body.phone),
    linkedinUrl: str(body.linkedinUrl),
    githubUrl: str(body.githubUrl),
    photoUrl: str(body.photoUrl),
    theme: (str(body.theme) || 'modern') as Portfolio['theme'],
    colorScheme: (str(body.colorScheme) || 'blue-purple') as Portfolio['colorScheme'],
    language: (str(body.language) || 'ar') as Portfolio['language'],
    projects: arr(body.projects).slice(0, 30),
    experiences: arr(body.experiences).slice(0, 30),
    certificates: arr(body.certificates).slice(0, 30),
    volunteering: arr(body.volunteering).slice(0, 30)
  };
}

export async function POST(request: Request) {
  try {
    const uid = await requireAuthedUid(request);
    const body = await request.json();

    if (!body?.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'الاسم الكامل مطلوب' }, { status: 400 });
    }

    const db = getAdminDb();
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    const existingUsername = userSnap.exists ? (userSnap.data()?.username as string | undefined) : undefined;

    const requested = typeof body.username === 'string' && body.username.trim() ? slugify(body.username) : existingUsername || slugify(body.name);

    const portfoliosCol = db.collection('portfolios');
    const targetRef = portfoliosCol.doc(requested);
    const targetSnap = await targetRef.get();

    let finalUsername = requested;
    if (targetSnap.exists && targetSnap.data()?.ownerUid !== uid) {
      // Username taken by someone else — disambiguate.
      finalUsername = `${requested}-${uid.slice(0, 5)}`;
    }

    const clean = sanitizePortfolio(body);
    const now = Date.now();

    const finalRef = portfoliosCol.doc(finalUsername);
    const finalSnap = finalUsername === requested ? targetSnap : await finalRef.get();

    const payload: Portfolio = {
      ...clean,
      username: finalUsername,
      ownerUid: uid,
      createdAt: finalSnap.exists ? (finalSnap.data()?.createdAt as number) ?? now : now,
      updatedAt: now
    };

    await finalRef.set(payload, { merge: false });

    // Rename cleanup: remove the old doc if the user changed their username.
    if (existingUsername && existingUsername !== finalUsername) {
      await portfoliosCol.doc(existingUsername).delete().catch(() => undefined);
    }

    await userRef.set({ username: finalUsername, updatedAt: now }, { merge: true });

    return NextResponse.json({
      success: true,
      username: finalUsername,
      shareUrl: `/p/${finalUsername}`
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
