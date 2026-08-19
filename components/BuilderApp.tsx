'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import LoginModal from './LoginModal';
import Navbar from './builder/Navbar';
import PersonalInfoSection from './builder/PersonalInfoSection';
import ProjectsSection from './builder/ProjectsSection';
import ExperienceSection from './builder/ExperienceSection';
import CertificatesSection from './builder/CertificatesSection';
import VolunteeringSection from './builder/VolunteeringSection';
import ContactSection from './builder/ContactSection';
import CustomizerPanel from './builder/CustomizerPanel';
import LinkedInImportPanel from './builder/LinkedInImportPanel';
import JobsMatchPanel from './builder/JobsMatchPanel';
import PublishPanel from './builder/PublishPanel';
import ProfileCompletionMeter from './ProfileCompletionMeter';
import PortfolioView from './PortfolioView';
import { EMPTY_PORTFOLIO, type Portfolio } from '@/lib/types';

type Tab = 'edit' | 'preview';

export default function BuilderApp() {
  const { user, getIdToken } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio>(EMPTY_PORTFOLIO);
  const [username, setUsername] = useState('');
  const [tab, setTab] = useState<Tab>('edit');
  const [loginOpen, setLoginOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function patch(p: Partial<Portfolio>) {
    setPortfolio((prev) => ({ ...prev, ...p }));
  }

  useEffect(() => {
    if (!user || loaded) return;
    (async () => {
      try {
        const token = await getIdToken();
        const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data?.portfolio) {
          setPortfolio(data.portfolio);
          setUsername(data.portfolio.username || '');
        }
      } catch {
        // ignore — user simply has no saved portfolio yet
      } finally {
        setLoaded(true);
      }
    })();
  }, [user, loaded, getIdToken]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-6 text-center sm:px-6">
        <h1 className="text-2xl font-black text-white sm:text-3xl">
          اصنع بورتفوليو شخصي استثنائي يبهر أصحاب العمل
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          منصة مجانية لبناء سيرة ذاتية تفاعلية، استورد بياناتك من LinkedIn، وحسّن صياغتك بالذكاء الاصطناعي — في دقائق.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* Tabs */}
        <div className="mb-6 flex justify-center gap-2">
          <button
            onClick={() => setTab('edit')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              tab === 'edit' ? 'bg-gradient-accent text-white' : 'bg-white/5 text-slate-300'
            }`}
          >
            تعديل البيانات
          </button>
          <button
            onClick={() => setTab('preview')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              tab === 'preview' ? 'bg-gradient-accent text-white' : 'bg-white/5 text-slate-300'
            }`}
          >
            المعاينة المباشرة
          </button>
        </div>

        {tab === 'preview' ? (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <PortfolioView portfolio={portfolio} live />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <LinkedInImportPanel
                onNeedsLogin={() => setLoginOpen(true)}
                onImported={(data) =>
                  patch({
                    name: data.name || portfolio.name,
                    bio: data.bio || portfolio.bio,
                    education: data.education || portfolio.education,
                    skills: data.skills || portfolio.skills,
                    experiences:
                      data.experiences?.map((e) => ({ id: crypto.randomUUID(), ...e })) ?? portfolio.experiences,
                    certificates:
                      data.certificates?.map((c) => ({ id: crypto.randomUUID(), imageUrl: '', ...c })) ??
                      portfolio.certificates,
                    volunteering:
                      data.volunteering?.map((v) => ({ id: crypto.randomUUID(), logoUrl: '', ...v })) ??
                      portfolio.volunteering
                  })
                }
              />

              <PersonalInfoSection portfolio={portfolio} onChange={patch} onNeedsLogin={() => setLoginOpen(true)} />
              <ProjectsSection
                items={portfolio.projects}
                onChange={(projects) => patch({ projects })}
                onNeedsLogin={() => setLoginOpen(true)}
              />
              <ExperienceSection
                items={portfolio.experiences}
                onChange={(experiences) => patch({ experiences })}
                onNeedsLogin={() => setLoginOpen(true)}
              />
              <CertificatesSection items={portfolio.certificates} onChange={(certificates) => patch({ certificates })} />
              <VolunteeringSection
                items={portfolio.volunteering}
                onChange={(volunteering) => patch({ volunteering })}
                onNeedsLogin={() => setLoginOpen(true)}
              />
              <ContactSection portfolio={portfolio} onChange={patch} />
            </div>

            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              <ProfileCompletionMeter portfolio={portfolio} />
              <CustomizerPanel
                theme={portfolio.theme}
                colorScheme={portfolio.colorScheme}
                language={portfolio.language}
                onChange={patch}
              />
              <JobsMatchPanel
                skills={portfolio.skills}
                certificates={portfolio.certificates}
                onNeedsLogin={() => setLoginOpen(true)}
              />
              <PublishPanel
                portfolio={portfolio}
                username={username}
                onUsernameChange={setUsername}
                onPublished={setUsername}
                onNeedsLogin={() => setLoginOpen(true)}
              />
            </aside>
          </div>
        )}
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
