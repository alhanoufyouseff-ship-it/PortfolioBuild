import type { Portfolio } from '@/lib/types';
import { getColorScheme, THEME_BACKGROUND, THEME_PANEL, THEME_TEXT } from '@/lib/theme';
import NeuralCanvas from './NeuralCanvas';

const T = {
  ar: {
    about: 'نبذة',
    education: 'التعليم',
    skills: 'المهارات التقنية',
    projects: 'المشاريع والأعمال',
    experience: 'الخبرات العملية',
    certificates: 'الشهادات والاعتمادات',
    volunteering: 'التطوع والأنشطة الطلابية',
    contact: 'تواصل معي',
    viewProject: 'عرض المشروع',
    poweredBy: 'صُنع باستخدام'
  },
  en: {
    about: 'About',
    education: 'Education',
    skills: 'Technical Skills',
    projects: 'Projects',
    experience: 'Experience',
    certificates: 'Certificates',
    volunteering: 'Volunteering & Activities',
    contact: 'Get in Touch',
    viewProject: 'View Project',
    poweredBy: 'Built with'
  }
};

export default function PortfolioView({ portfolio, live = false }: { portfolio: Portfolio; live?: boolean }) {
  const t = T[portfolio.language] ?? T.ar;
  const dir = portfolio.language === 'en' ? 'ltr' : 'rtl';
  const scheme = getColorScheme(portfolio.colorScheme);
  const skillsList = portfolio.skills.split(',').map((s) => s.trim()).filter(Boolean);

  const style = { ['--accent-from' as string]: scheme.from, ['--accent-to' as string]: scheme.to };

  return (
    <div
      dir={dir}
      lang={portfolio.language}
      style={style}
      className={`relative min-h-screen ${THEME_BACKGROUND[portfolio.theme]} ${THEME_TEXT[portfolio.theme]}`}
    >
      {!live && <NeuralCanvas colorScheme={portfolio.colorScheme} />}

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <section className={`rounded-2xl p-6 sm:p-8 text-center ${THEME_PANEL[portfolio.theme]}`}>
          {portfolio.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portfolio.photoUrl}
              alt={portfolio.name}
              className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-white/10 sm:h-28 sm:w-28"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-accent text-3xl font-black text-white sm:h-28 sm:w-28">
              {portfolio.name.trim().charAt(0) || '?'}
            </div>
          )}
          <h1 className="text-2xl font-black sm:text-3xl">{portfolio.name || '—'}</h1>
          {portfolio.education && <p className="mt-1 text-sm opacity-70">{portfolio.education}</p>}

          {portfolio.bio && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed opacity-90 sm:text-base">
              {portfolio.bio}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {portfolio.email && <ContactPill href={`mailto:${portfolio.email}`} label={portfolio.email} />}
            {portfolio.phone && <ContactPill href={`tel:${portfolio.phone}`} label={portfolio.phone} />}
            {portfolio.linkedinUrl && <ContactPill href={portfolio.linkedinUrl} label="LinkedIn" />}
            {portfolio.githubUrl && <ContactPill href={portfolio.githubUrl} label="GitHub" />}
          </div>
        </section>

        {/* Skills */}
        {skillsList.length > 0 && (
          <Section title={t.skills}>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gradient-accent px-3 py-1 text-xs font-bold text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {portfolio.projects.length > 0 && (
          <Section title={t.projects}>
            <div className="grid gap-4 sm:grid-cols-2">
              {portfolio.projects.map((proj) => (
                <div key={proj.id} className={`rounded-xl p-4 ${THEME_PANEL[portfolio.theme]}`}>
                  {proj.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={proj.imageUrl} alt={proj.title} className="mb-3 h-32 w-full rounded-lg object-cover" />
                  )}
                  <h3 className="font-bold">{proj.title}</h3>
                  {proj.description && <p className="mt-1 text-xs opacity-80 leading-relaxed">{proj.description}</p>}
                  {proj.tags && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {proj.tags.split(',').map((tag) => (
                        <span key={tag} className="rounded bg-white/10 px-2 py-0.5 text-[10px]">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.projectLink && (
                    <a
                      href={proj.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs font-semibold text-[var(--accent-from)] hover:underline"
                    >
                      {t.viewProject} ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Experience */}
        {portfolio.experiences.length > 0 && (
          <Section title={t.experience}>
            <div className="space-y-3">
              {portfolio.experiences.map((exp) => (
                <div key={exp.id} className={`rounded-xl p-4 ${THEME_PANEL[portfolio.theme]}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <h3 className="font-bold">{exp.title}</h3>
                    {exp.duration && <span className="text-xs opacity-60">{exp.duration}</span>}
                  </div>
                  {exp.company && <p className="text-xs opacity-70">{exp.company}</p>}
                  {exp.description && <p className="mt-1 text-xs opacity-80 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Certificates */}
        {portfolio.certificates.length > 0 && (
          <Section title={t.certificates}>
            <div className="grid gap-3 sm:grid-cols-2">
              {portfolio.certificates.map((cert) => (
                <div key={cert.id} className={`flex items-center gap-3 rounded-xl p-3 ${THEME_PANEL[portfolio.theme]}`}>
                  {cert.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cert.imageUrl} alt={cert.title} className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-accent text-white text-xs">🏆</div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold">{cert.title}</h3>
                    <p className="text-[11px] opacity-70">
                      {cert.issuer} {cert.year && `· ${cert.year}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Volunteering */}
        {portfolio.volunteering.length > 0 && (
          <Section title={t.volunteering}>
            <div className="space-y-3">
              {portfolio.volunteering.map((vol) => (
                <div key={vol.id} className={`rounded-xl p-4 ${THEME_PANEL[portfolio.theme]}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <h3 className="font-bold">{vol.role}</h3>
                    {vol.duration && <span className="text-xs opacity-60">{vol.duration}</span>}
                  </div>
                  {vol.organization && <p className="text-xs opacity-70">{vol.organization}</p>}
                  {vol.description && <p className="mt-1 text-xs opacity-80 leading-relaxed">{vol.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {!live && (
          <footer className="pt-6 text-center text-xs opacity-50">
            {t.poweredBy}{' '}
            <a href="/" className="font-bold text-[var(--accent-from)] hover:underline">
              PortfolioBuild
            </a>
          </footer>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

function ContactPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold hover:bg-white/10 transition"
    >
      {label}
    </a>
  );
}
