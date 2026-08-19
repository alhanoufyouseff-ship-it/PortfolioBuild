import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import type { Portfolio } from '@/lib/types';
import PortfolioView from '@/components/PortfolioView';

export const revalidate = 60;

async function getPortfolio(username: string): Promise<Portfolio | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const snap = await getAdminDb().collection('portfolios').doc(username).get();
  if (!snap.exists) return null;
  return snap.data() as Portfolio;
}

export async function generateMetadata({
  params
}: {
  params: { username: string };
}): Promise<Metadata> {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) {
    return { title: 'البورتفوليو غير موجود | PortfolioBuild' };
  }
  return {
    title: `${portfolio.name} | PortfolioBuild`,
    description: portfolio.bio || `بورتفوليو ${portfolio.name} الشخصي`,
    openGraph: {
      title: portfolio.name,
      description: portfolio.bio,
      images: portfolio.photoUrl ? [portfolio.photoUrl] : undefined
    }
  };
}

export default async function PublicPortfolioPage({ params }: { params: { username: string } }) {
  const portfolio = await getPortfolio(params.username);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioView portfolio={portfolio} />;
}
