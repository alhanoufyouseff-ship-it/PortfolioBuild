import 'server-only';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
}

/**
 * Fetches live job listings. When JOB_SEARCH_API_KEY is set it queries
 * JSearch (RapidAPI) — a common choice for aggregated job search. Without
 * a key it falls back to Remotive's free public API so the feature still
 * works out of the box in development.
 */
export async function fetchJobListings(query: string): Promise<{ jobs: JobListing[]; demo: boolean }> {
  const apiKey = process.env.JOB_SEARCH_API_KEY;

  if (apiKey) {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`;
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`فشل جلب الوظائف (${response.status})`);
    }

    const data = await response.json();
    const jobs: JobListing[] = (data?.data || []).slice(0, 10).map((j: Record<string, unknown>) => ({
      id: String(j.job_id ?? crypto.randomUUID()),
      title: String(j.job_title ?? ''),
      company: String(j.employer_name ?? ''),
      location: String(j.job_city ?? j.job_country ?? ''),
      url: String(j.job_apply_link ?? ''),
      description: String(j.job_description ?? '').slice(0, 1200)
    }));

    return { jobs, demo: false };
  }

  const response = await fetch(
    `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=10`
  );

  if (!response.ok) {
    throw new Error(`فشل جلب الوظائف (${response.status})`);
  }

  const data = await response.json();
  const jobs: JobListing[] = (data?.jobs || []).slice(0, 10).map((j: Record<string, unknown>) => ({
    id: String(j.id ?? crypto.randomUUID()),
    title: String(j.title ?? ''),
    company: String(j.company_name ?? ''),
    location: String(j.candidate_required_location ?? ''),
    url: String(j.url ?? ''),
    description: String(j.description ?? '').replace(/<[^>]+>/g, ' ').slice(0, 1200)
  }));

  return { jobs, demo: true };
}
