'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import LoginModal from './LoginModal';
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
import NeuralCanvas from './NeuralCanvas';
import { EMPTY_PORTFOLIO, type Portfolio } from '@/lib/types';

type Tab = 'edit' | 'preview';

export default function BuilderApp() {
  const { user, logout, getIdToken } = useAuth();
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
    <div
      dir="rtl"
      data-theme={portfolio.theme}
      data-color={portfolio.colorScheme}
      className="pb-root relative min-h-screen"
    >
      <NeuralCanvas colorScheme={portfolio.colorScheme} />

      <div className="main-content flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3 text-start group transition">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition">
                <i className="fa-solid fa-code text-lg" />
              </div>
              <div>
                <div className="font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                  <span>PortfolioBuild</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase font-mono">
                    PRO
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  باني البورتفوليو التفاعلي للمطورين والمبتكرين
                </div>
              </div>
            </a>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-slate-300 sm:inline">{user.displayName || user.email}</span>
                <button
                  onClick={() => logout()}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold glow-btn flex items-center gap-2"
              >
                <i className="fa-solid fa-user text-xs" />
                <span>تسجيل الدخول</span>
              </button>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-4 lg:px-8 pt-10 pb-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-tag text-xs font-semibold shadow-inner">
            <i className="fa-solid fa-wand-magic-sparkles" />
            <span>جيل جديد من باني السير الذاتية البرمجية التفاعلية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
            اصنع بورتفوليو شخصي استثنائي يبهر أصحاب العمل
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            استورد بياناتك من LinkedIn تلقائياً، وحسّن صياغتك بالذكاء الاصطناعي، وانشر بورتفوليو تفاعلي في دقائق.
          </p>
        </section>

        <div className="mx-auto max-w-6xl w-full px-4 pb-16 sm:px-6">
          {/* Tabs */}
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setTab('edit')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                  tab === 'edit' ? 'bg-white/10 text-white ring-2 ring-indigo-400' : 'opacity-60 hover:opacity-100 text-slate-300'
                }`}
              >
                <i className="fa-solid fa-pen-to-square" />
                <span>تعديل البيانات</span>
              </button>
              <button
                onClick={() => setTab('preview')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                  tab === 'preview' ? 'bg-white/10 text-white ring-2 ring-indigo-400' : 'opacity-60 hover:opacity-100 text-slate-300'
                }`}
              >
                <i className="fa-solid fa-eye" />
                <span>المعاينة المباشرة</span>
              </button>
            </div>
          </div>

          {tab === 'preview' ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 glass-panel">
              <PortfolioView portfolio={portfolio} live />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
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

              <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
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

        <footer className="py-6 text-center text-xs text-slate-500 border-t border-white/5">
          <div className="flex items-center justify-center gap-1">
            <span>Powered by</span>
            <span className="text-indigo-400 font-bold">PortfolioBuild</span>
          </div>
        </footer>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
