import type { Portfolio } from '@/lib/types';
import NeuralCanvas from './NeuralCanvas';

const T = {
  ar: {
    skills: 'المهارات التقنية',
    projects: 'المشاريع والأعمال',
    viewDemo: 'عرض المشروع',
    experience: 'الخبرات العملية والتدريب',
    certificates: 'الشهادات والاعتمادات',
    volunteering: 'الأنشطة التطوعية والنوادي الطلابية',
    contactTitle: 'تواصل معي',
    contactSubtitle: 'يسعدني التواصل معك واستقبال الفرص والمقترحات!'
  },
  en: {
    skills: 'Technical Arsenal',
    projects: 'Featured Projects',
    viewDemo: 'View Demo',
    experience: 'Experience',
    certificates: 'Certifications',
    volunteering: 'Volunteering & Student Clubs',
    contactTitle: 'Get in Touch',
    contactSubtitle: 'Feel free to reach out for collaborations or opportunities!'
  }
};

function IconChip({ icon }: { icon: string }) {
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm shrink-0">
      <i className={`fa-solid ${icon}`} />
    </div>
  );
}

function SectionHeading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <IconChip icon={icon} />
      <h2 className="text-xl font-bold text-white tracking-wide">{children}</h2>
    </div>
  );
}

export default function PortfolioView({ portfolio, live = false }: { portfolio: Portfolio; live?: boolean }) {
  const t = T[portfolio.language] ?? T.ar;
  const dir = portfolio.language === 'en' ? 'ltr' : 'rtl';
  const isAr = portfolio.language !== 'en';
  const skillsList = portfolio.skills.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div
      dir={dir}
      lang={portfolio.language}
      data-theme={portfolio.theme}
      data-color={portfolio.colorScheme}
      className="pb-root relative min-h-screen"
    >
      {!live && <NeuralCanvas colorScheme={portfolio.colorScheme} />}

      <div className="main-content max-w-5xl w-full mx-auto px-4 lg:px-8 py-10 space-y-12">
        {/* Hero Section */}
        <header className="glass-panel rounded-2xl p-8 md:p-12 border border-white/10 glow-card">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-indigo-400/50 shadow-2xl bg-slate-900 flex items-center justify-center">
                {portfolio.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portfolio.photoUrl} alt={portfolio.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl font-bold text-gradient">
                    <i className="fa-solid fa-code" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4 text-center md:text-start flex-1">
              {portfolio.education && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-tag text-xs font-semibold">
                  <i className="fa-solid fa-graduation-cap" />
                  <span>{portfolio.education}</span>
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">{portfolio.name || '—'}</h1>
              {portfolio.bio && (
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">{portfolio.bio}</p>
              )}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {portfolio.linkedinUrl && (
                  <a
                    href={portfolio.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition flex items-center gap-2"
                  >
                    <i className="fa-brands fa-linkedin text-indigo-400 text-sm" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {portfolio.githubUrl && (
                  <a
                    href={portfolio.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition flex items-center gap-2"
                  >
                    <i className="fa-brands fa-github text-indigo-400 text-sm" />
                    <span>GitHub</span>
                  </a>
                )}
                {portfolio.email && (
                  <a
                    href={`mailto:${portfolio.email}`}
                    className="px-4 py-2 rounded-lg bg-gradient-primary text-white text-xs font-medium glow-btn flex items-center gap-2"
                  >
                    <i className="fa-solid fa-paper-plane text-xs" />
                    <span>{isAr ? 'تواصل معي' : 'Contact Me'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Skills */}
        {skillsList.length > 0 && (
          <section className="space-y-4">
            <SectionHeading icon="fa-layer-group">{t.skills}</SectionHeading>
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <div className="flex flex-wrap gap-2.5">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="badge-tag px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <i className="fa-solid fa-code text-[10px] opacity-70" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects.length > 0 && (
          <section className="space-y-6">
            <SectionHeading icon="fa-cubes">{t.projects}</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col glow-card group"
                >
                  <div className="w-full h-44 bg-slate-900 relative overflow-hidden border-b border-white/10">
                    {proj.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-slate-700">
                        <i className="fa-solid fa-laptop-code" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition">
                        {proj.title}
                      </h3>
                      {proj.description && (
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{proj.description}</p>
                      )}
                    </div>
                    <div className="space-y-4">
                      {proj.tags && (
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tags
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-indigo-300 border border-white/5 font-mono"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                      {proj.projectLink && (
                        <a
                          href={proj.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition flex items-center justify-center gap-2"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                          <span>{t.viewDemo}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience & Certificates */}
        {(portfolio.experiences.length > 0 || portfolio.certificates.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {portfolio.experiences.length > 0 && (
              <section className="space-y-4">
                <SectionHeading icon="fa-briefcase">{t.experience}</SectionHeading>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                  {portfolio.experiences.map((exp, i) => (
                    <div
                      key={exp.id}
                      className={i < portfolio.experiences.length - 1 ? 'pb-6 border-b border-white/5' : ''}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-white">{exp.title}</h3>
                        {exp.duration && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono shrink-0">
                            {exp.duration}
                          </span>
                        )}
                      </div>
                      {exp.company && <div className="text-xs font-semibold text-indigo-300 mt-0.5">{exp.company}</div>}
                      {exp.description && (
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {portfolio.certificates.length > 0 && (
              <section className="space-y-4">
                <SectionHeading icon="fa-award">{t.certificates}</SectionHeading>
                <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  {portfolio.certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {cert.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                        ) : (
                          <i className="fa-solid fa-certificate text-indigo-400 text-base" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs md:text-sm text-white truncate">{cert.title}</h3>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          {cert.issuer && <span className="text-indigo-300">{cert.issuer}</span>}
                          {cert.year && (
                            <>
                              <span>•</span>
                              <span>{cert.year}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Volunteering */}
        {portfolio.volunteering.length > 0 && (
          <section className="space-y-6">
            <SectionHeading icon="fa-users">{t.volunteering}</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.volunteering.map((vol) => (
                <div key={vol.id} className="glass-panel p-6 rounded-2xl border border-white/10 flex items-start gap-4 glow-card">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {vol.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={vol.logoUrl} alt={vol.organization} className="w-full h-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-hands-holding-circle text-indigo-400 text-xl" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-white truncate">{vol.role}</h3>
                      {vol.duration && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 shrink-0 font-mono">
                          {vol.duration}
                        </span>
                      )}
                    </div>
                    {vol.organization && <div className="text-xs font-semibold text-indigo-300">{vol.organization}</div>}
                    {vol.description && <p className="text-xs text-slate-300 leading-relaxed pt-1">{vol.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <footer className="glass-panel rounded-2xl p-8 md:p-10 border border-white/10 text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-black text-white">{t.contactTitle}</h2>
            <p className="text-xs md:text-sm text-slate-300">{t.contactSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {portfolio.email && (
              <a
                href={`mailto:${portfolio.email}`}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition flex items-center gap-2.5 glow-btn"
              >
                <i className="fa-solid fa-envelope text-indigo-400" />
                <span>{portfolio.email}</span>
              </a>
            )}
            {portfolio.phone && (
              <a
                href={`tel:${portfolio.phone}`}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition flex items-center gap-2.5 glow-btn"
              >
                <i className="fa-solid fa-phone text-emerald-400" />
                <span>{portfolio.phone}</span>
              </a>
            )}
            {portfolio.linkedinUrl && (
              <a
                href={portfolio.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition flex items-center gap-2.5 glow-btn"
              >
                <i className="fa-brands fa-linkedin text-sky-400" />
                <span>LinkedIn</span>
              </a>
            )}
            {portfolio.githubUrl && (
              <a
                href={portfolio.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition flex items-center gap-2.5 glow-btn"
              >
                <i className="fa-brands fa-github text-purple-400" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </footer>

        {!live && (
          <div className="py-6 text-center text-xs text-slate-500 border-t border-white/5 flex items-center justify-center gap-1">
            <span>Powered by</span>
            <a href="/" className="text-indigo-400 hover:underline font-bold">
              PortfolioBuild
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
