import 'server-only';

/**
 * Runs an Apify LinkedIn profile scraper actor synchronously and returns
 * the raw dataset items. Server-side only — APIFY_API_KEY must never
 * reach the client.
 *
 * The default actor id points to a generic public LinkedIn profile
 * scraper slug. Verify the exact actor + input schema on your Apify
 * console and override with APIFY_LINKEDIN_ACTOR_ID if it differs.
 */
export async function scrapeLinkedInProfile(profileUrl: string): Promise<Record<string, unknown>> {
  const token = process.env.APIFY_API_KEY;
  if (!token) {
    throw new Error('APIFY_API_KEY غير مضبوط على السيرفر');
  }

  const actorId = process.env.APIFY_LINKEDIN_ACTOR_ID || 'dev_fusion~linkedin-profile-scraper';
  const url = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileUrls: [profileUrl] })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`فشل الاتصال بـ Apify (${response.status}): ${errText.slice(0, 300)}`);
  }

  const items = (await response.json()) as Record<string, unknown>[];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('لم يتم العثور على بيانات عامة لهذا الحساب على LinkedIn');
  }

  return items[0];
}

export function isValidLinkedInUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return /(^|\.)linkedin\.com$/i.test(parsed.hostname) && /\/in\//i.test(parsed.pathname);
  } catch {
    return false;
  }
}
