/**
 * PortfolioBuild - LinkedIn Quick Sync Simulator
 * Provides a seamless, realistic simulation of LinkedIn OAuth and profile extraction
 */
const LinkedInSync = (function () {
  const mockProfiles = {
    ar: {
      name: 'ريان الغامدي',
      bio: 'مهندس برمجيات ومطور واجهات متقدمة متخصص في بناء التطبيقات السحابية وتكاملات الذكاء الاصطناعي مع شغف بالأنظمة الموزعة.',
      education: 'بكالوريوس علوم الحاسب - جامعة الملك سعود (KSU)',
      skills: 'React, TypeScript, Node.js, Python, Fastify, Docker, GraphQL, TailwindCSS, PostgreSQL, Redis, Jest',
      email: 'rayan.alghamdi@devmail.com',
      phone: '+966509876543',
      linkedin_url: 'https://linkedin.com/in/rayan-alghamdi',
      github_url: 'https://github.com/rayan-gh',
      photo_path: '/static/assets/sample/avatar.svg',
      projects: [
        {
          id: 'proj-sync-1',
          title: 'CloudSync - منصة التزامن السحابي الفوري',
          description: 'نظام بنية سحابية متناهية الصغر يتيح مزامنة الملفات والبيانات الحية بزمن استجابة أقل من 50 مللي ثانية.',
          tags: 'Node.js, WebSocket, Docker, Redis',
          project_link: 'https://github.com/rayan-gh/cloudsync',
          image_path: '/static/assets/sample/project1.svg'
        },
        {
          id: 'proj-sync-2',
          title: 'CodePulse - أداة تدقيق وتتبع جودة الأكواد',
          description: 'أداة مفتوحة المصدر لتحليل الكود المصدري واكتشاف الثغرات الأمنية تلقائياً قبل الدمج في مستودعات Git.',
          tags: 'TypeScript, AST Parser, React, Tailwind',
          project_link: 'https://github.com/rayan-gh/codepulse',
          image_path: '/static/assets/sample/project2.svg'
        }
      ],
      experiences: [
        {
          id: 'exp-sync-1',
          title: 'مطور واجهات ومساعد تقني',
          company: 'حاضنة الابتكار الرقمي - الرياض',
          duration: 'أكتوبر 2024 - حتى الآن',
          description: 'بناء وتطوير واجهات تفاعلية لأكثر من 6 شركات ناشئة باستخدام React وNext.js وتحسين مقاييس Core Web Vitals بنسبة 35%.'
        }
      ],
      certificates: [
        {
          id: 'cert-sync-1',
          title: 'Meta Certified Front-End Developer',
          issuer: 'Meta / Coursera',
          year: '2024',
          image_path: '/static/assets/sample/cert2.svg'
        }
      ],
      volunteering: [
        {
          id: 'vol-sync-1',
          title: '',
          role: 'مسؤول اللجنة التقنية - نادي البرمجة الجامعي',
          organization: 'جامعة الملك سعود',
          duration: '2024 - 2025',
          description: 'إدارة المعسكرات التدريبية وتدريب أكثر من 400 طالب على أساسيات تطوير الويب الحديث وإدارة المشاريع مفتوحة المصدر.',
          logo_path: '/static/assets/sample/club1.svg'
        }
      ]
    },
    en: {
      name: 'Rayan Al-Ghamdi',
      bio: 'Software Engineer & Full-Stack Developer specialized in scalable cloud architectures, AI integrations, and responsive micro-frontends.',
      education: 'B.S. in Computer Science - King Saud University (KSU)',
      skills: 'React, TypeScript, Node.js, Python, Fastify, Docker, GraphQL, TailwindCSS, PostgreSQL, Redis, Jest',
      email: 'rayan.alghamdi@devmail.com',
      phone: '+966509876543',
      linkedin_url: 'https://linkedin.com/in/rayan-alghamdi',
      github_url: 'https://github.com/rayan-gh',
      photo_path: '/static/assets/sample/avatar.svg',
      projects: [
        {
          id: 'proj-sync-1',
          title: 'CloudSync - Real-Time State Synchronization Engine',
          description: 'High-throughput microservices architecture synchronizing live events with sub-50ms latency.',
          tags: 'Node.js, WebSocket, Docker, Redis',
          project_link: 'https://github.com/rayan-gh/cloudsync',
          image_path: '/static/assets/sample/project1.svg'
        },
        {
          id: 'proj-sync-2',
          title: 'CodePulse - Automated Static Analysis Suite',
          description: 'Open-source code auditor identifying security vulnerabilities and code smells prior to Git PR merges.',
          tags: 'TypeScript, AST Parser, React, Tailwind',
          project_link: 'https://github.com/rayan-gh/codepulse',
          image_path: '/static/assets/sample/project2.svg'
        }
      ],
      experiences: [
        {
          id: 'exp-sync-1',
          title: 'Full-Stack Developer & Tech Fellow',
          company: 'Digital Innovation Incubator - Riyadh',
          duration: 'Oct 2024 - Present',
          description: 'Engineered web applications for 6 high-growth ventures using React & Next.js, boosting Core Web Vitals by 35%.'
        }
      ],
      certificates: [
        {
          id: 'cert-sync-1',
          title: 'Meta Certified Front-End Developer',
          issuer: 'Meta / Coursera',
          year: '2024',
          image_path: '/static/assets/sample/cert2.svg'
        }
      ],
      volunteering: [
        {
          id: 'vol-sync-1',
          role: 'Lead of Technical Committee - CS Club',
          organization: 'King Saud University',
          duration: '2024 - 2025',
          description: 'Orchestrated technical bootcamps training 400+ students on modern web architecture and open-source contributions.',
          logo_path: '/static/assets/sample/club1.svg'
        }
      ]
    }
  };

  function startSync(onComplete) {
    const modal = document.getElementById('linkedin-modal');
    const progressBar = document.getElementById('linkedin-progress');
    const statusText = document.getElementById('linkedin-status');
    const currentLang = Customizer.getState().language;

    if (!modal || !progressBar || !statusText) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    progressBar.style.width = '10%';
    statusText.textContent = Customizer.t('syncStep1');

    setTimeout(() => {
      progressBar.style.width = '55%';
      statusText.textContent = Customizer.t('syncStep2');
    }, 700);

    setTimeout(() => {
      progressBar.style.width = '90%';
      statusText.textContent = Customizer.t('syncStep3');
    }, 1400);

    setTimeout(() => {
      progressBar.style.width = '100%';
      statusText.textContent = Customizer.t('syncComplete');

      const data = mockProfiles[currentLang] || mockProfiles.ar;
      if (onComplete) onComplete(data);

      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        if (window.App && window.App.showToast) {
          window.App.showToast(Customizer.t('syncComplete'), 'success');
        }
      }, 600);
    }, 2000);
  }

  return {
    startSync
  };
})();
