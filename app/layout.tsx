import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'PortfolioBuild — باني البورتفوليو التفاعلي',
  description:
    'اصنع بورتفوليو شخصي احترافي في دقائق، استورد بياناتك من LinkedIn تلقائياً، وحسّن صياغتك بالذكاء الاصطناعي.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
