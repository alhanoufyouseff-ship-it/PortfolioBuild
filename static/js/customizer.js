/**
 * PortfolioBuild - Real-Time Customizer
 * Controls Themes, Color Palettes, and Language (RTL/LTR)
 */
const Customizer = (function () {
  const state = {
    theme: 'modern',
    colorScheme: 'blue-purple',
    language: 'ar'
  };

  // UI Strings Dictionary
  const i18n = {
    ar: {
      appName: 'PortfolioBuild',
      appTagline: 'باني البورتفوليو التفاعلي للمطورين والمبتكرين',
      welcomeTitle: 'اصنع بورتفوليو شخصي استثنائي يبهر أصحاب العمل وشركاء المشاريع',
      welcomeSubtitle: 'منصة مخصصة لطلاب الجامعات والمطورين لبناء سيرة ذاتية تفاعلية حديثة، تدعم التخصيص اللحظي، وشبكة ذكاء اصطناعي تفاعلية في ثوانٍ معدودة.',
      btnCreateProfile: 'ابدأ بناء ملفك الشخصي',
      btnViewExample: 'معاينة نموذج جاهز',
      btnBackToWelcome: 'العودة للرئيسية',
      btnLivePreview: 'المعاينة المباشرة',
      btnEditForm: 'تعديل البيانات',
      btnPublish: 'نشر البورتفوليو',
      btnPublishing: 'جاري النشر...',
      btnConnectLinkedIn: 'ربط حساب LinkedIn',
      customizerTitle: 'لوحة التخصيص اللحظي',
      themeLabel: 'النمط البصري (Theme):',
      colorLabel: 'لوحة الألوان (Color Palette):',
      langLabel: 'اللغة والاتجاه:',
      themeModern: 'Modern Glass (زجاجي عصري)',
      themeMinimal: 'Minimal Clean (بسيط وأنيق)',
      themeCreative: 'Creative Glow (توهج إبداعي)',
      themeProfessional: 'Professional (رسمي)',
      themeCyber: 'Dark Cyber (مستقبلي)',
      colorBlue: 'أزرق (Blue)',
      colorPurple: 'بنفسجي (Purple)',
      colorBluePurple: 'أزرق + بنفسجي',
      colorGreen: 'أخضر زمردي',
      colorPink: 'وردي نيون',
      colorBlackWhite: 'أبيض وأسود',
      sectionPersonalInfo: 'البيانات الشخصية والتعليم',
      sectionSkills: 'المهارات التقنية',
      sectionProjects: 'المشاريع والأعمال',
      sectionExperience: 'الخبرات العملية والتدريب',
      sectionCertificates: 'الشهادات والاعتمادات',
      sectionVolunteering: 'التطوع والنوادي الطلابية',
      sectionContact: 'معلومات التواصل والروابط',
      labelFullName: 'الاسم الكامل',
      labelBio: 'النبذة التعريفية (Bio)',
      labelEducation: 'الجامعة / التخصص الدراسي',
      labelPhoto: 'الصورة الشخصية (رفع مباشر)',
      labelSkillsInput: 'أدخل المهارات (افصل بينها بفاصلة)',
      labelProjectTitle: 'عنوان المشروع',
      labelProjectDesc: 'وصف المشروع وما تم إنجازه',
      labelProjectTags: 'التقنيات المستخدمة (مفصولة بفواصل)',
      labelProjectLink: 'رابط المشروع / الديمو (اختياري)',
      labelProjectImage: 'صورة المشروع (رفع مباشر)',
      btnAddProject: 'إضافة مشروع جديد',
      labelExpTitle: 'المسمى الوظيفي',
      labelExpCompany: 'الشركة / الجهة',
      labelExpDuration: 'الفترة الزمنية',
      labelExpDesc: 'شرح المهام والإنجازات',
      btnAddExp: 'إضافة خبرة جديدة',
      labelCertTitle: 'عنوان الشهادة',
      labelCertIssuer: 'الجهة المانحة',
      labelCertYear: 'سنة الحصول عليها',
      labelCertImage: 'صورة/شعار الشهادة',
      btnAddCert: 'إضافة شهادة جديدة',
      labelVolRole: 'المسمى / الدور (مثلاً: رئيس نادي الحاسب)',
      labelVolOrg: 'اسم النادي / المنظمة',
      labelVolDuration: 'الفترة الزمنية',
      labelVolDesc: 'شرح الأنشطة والمساهمات',
      labelVolLogo: 'شعار النادي أو الصورة',
      btnAddVol: 'إضافة نشاط طلابي / تطوعي',
      labelEmail: 'البريد الإلكتروني',
      labelPhone: 'رقم الجوال',
      labelLinkedIn: 'رابط LinkedIn',
      labelGitHub: 'رابط GitHub',
      dropzoneText: 'اسحب وأفلت الصورة هنا أو انقر للاختيار من جهازك',
      viewDemoBtn: 'عرض المشروع',
      contactHeading: 'تواصل معي',
      getInTouch: 'هل لديك فكرة مشروع أو فرصة عمل؟ يسعدني التواصل معك!',
      sendEmail: 'إرسال بريد',
      callPhone: 'اتصال هاتفي',
      publishModalTitle: 'تهانينا! تم نشر البورتفوليو بنجاح',
      publishModalDesc: 'أصبح موقعك الشخصي متاحاً وجاهزاً للمشاركة مع الجميع عبر الرابط التالي:',
      copyLinkBtn: 'نسخ الرابط',
      copiedText: 'تم النسخ بنجاح!',
      openLiveBtn: 'فتح البورتفوليو في صفحة مستقلة',
      closeModalBtn: 'إغلاق',
      linkedInSyncTitle: 'محاكاة استيراد الملف من LinkedIn',
      linkedInSyncDesc: 'سيتم استيراد الملف المهني وتعبئة الحقول تلقائياً لتسهيل البناء السريع.',
      syncStep1: 'جاري الاتصال بخوادم LinkedIn...',
      syncStep2: 'استخراج الشهادات والمشاريع والخبرات الأكاديمية...',
      syncStep3: 'تجهيز وتنسيق البيانات...',
      syncComplete: 'تم الاستيراد بنجاح! يمكنك الآن تعديل أي حقل.'
    },
    en: {
      appName: 'PortfolioBuild',
      appTagline: 'Interactive Portfolio Builder for Developers & Innovators',
      welcomeTitle: 'Craft an Exceptional Interactive Portfolio in Minutes',
      welcomeSubtitle: 'Designed for university students and software engineers to showcase projects, skills, certifications, and student club leadership with real-time customization and interactive AI neural physics.',
      btnCreateProfile: 'Create My Profile',
      btnViewExample: 'View Example Portfolio',
      btnBackToWelcome: 'Back to Home',
      btnLivePreview: 'Live Preview',
      btnEditForm: 'Edit Profile',
      btnPublish: 'Publish Portfolio',
      btnPublishing: 'Publishing...',
      btnConnectLinkedIn: 'Connect My LinkedIn',
      customizerTitle: 'Real-Time Customizer',
      themeLabel: 'Visual Theme:',
      colorLabel: 'Color Palette:',
      langLabel: 'Language & Direction:',
      themeModern: 'Modern Glass',
      themeMinimal: 'Minimal Clean',
      themeCreative: 'Creative Glow',
      themeProfessional: 'Professional',
      themeCyber: 'Dark Cyber',
      colorBlue: 'Ocean Blue',
      colorPurple: 'Deep Purple',
      colorBluePurple: 'Blue + Purple',
      colorGreen: 'Emerald Green',
      colorPink: 'Neon Pink',
      colorBlackWhite: 'Monochrome',
      sectionPersonalInfo: 'Personal Information & Education',
      sectionSkills: 'Technical Skills',
      sectionProjects: 'Featured Projects',
      sectionExperience: 'Work Experience & Internships',
      sectionCertificates: 'Certifications & Accreditations',
      sectionVolunteering: 'Volunteering & Student Clubs',
      sectionContact: 'Contact & Social Links',
      labelFullName: 'Full Name',
      labelBio: 'Professional Bio',
      labelEducation: 'University / Degree',
      labelPhoto: 'Profile Photo (Direct Upload)',
      labelSkillsInput: 'Enter technical skills (comma separated)',
      labelProjectTitle: 'Project Title',
      labelProjectDesc: 'Project description & achievements',
      labelProjectTags: 'Technologies Used (comma separated)',
      labelProjectLink: 'Project / Live Demo URL (Optional)',
      labelProjectImage: 'Project Thumbnail (Direct Upload)',
      btnAddProject: 'Add Project',
      labelExpTitle: 'Job Title / Role',
      labelExpCompany: 'Company / Organization',
      labelExpDuration: 'Time Period',
      labelExpDesc: 'Key responsibilities & impact',
      btnAddExp: 'Add Experience',
      labelCertTitle: 'Certificate Title',
      labelCertIssuer: 'Issuing Organization',
      labelCertYear: 'Issue Year',
      labelCertImage: 'Certificate Image / Badge',
      btnAddCert: 'Add Certificate',
      labelVolRole: 'Role / Position (e.g. Club President)',
      labelVolOrg: 'Club / Organization Name',
      labelVolDuration: 'Time Period',
      labelVolDesc: 'Activities & leadership highlights',
      labelVolLogo: 'Club Logo / Image',
      btnAddVol: 'Add Club / Volunteering',
      labelEmail: 'Email Address',
      labelPhone: 'Phone Number',
      labelLinkedIn: 'LinkedIn Profile URL',
      labelGitHub: 'GitHub Profile URL',
      dropzoneText: 'Drag & drop image here or click to browse device',
      viewDemoBtn: 'View Demo',
      contactHeading: 'Get in Touch',
      getInTouch: 'Have a project in mind or an exciting opportunity? Let\'s connect!',
      sendEmail: 'Send Email',
      callPhone: 'Direct Call',
      publishModalTitle: 'Congratulations! Portfolio Published',
      publishModalDesc: 'Your interactive portfolio is live and ready to share with the world:',
      copyLinkBtn: 'Copy Link',
      copiedText: 'Copied to Clipboard!',
      openLiveBtn: 'Open Standalone Portfolio',
      closeModalBtn: 'Close',
      linkedInSyncTitle: 'LinkedIn Quick Sync Simulation',
      linkedInSyncDesc: 'Simulating data import to populate your portfolio fields automatically.',
      syncStep1: 'Connecting to LinkedIn OAuth Simulation...',
      syncStep2: 'Extracting verified credentials and projects...',
      syncStep3: 'Structuring profile data...',
      syncComplete: 'Import complete! All fields remain fully editable.'
    }
  };

  function init() {
    // Load from localStorage or defaults
    const savedTheme = localStorage.getItem('pb_theme') || 'modern';
    const savedColor = localStorage.getItem('pb_color') || 'blue-purple';
    const savedLang = localStorage.getItem('pb_lang') || 'ar';

    setTheme(savedTheme);
    setColorScheme(savedColor);
    setLanguage(savedLang);

    bindEvents();
  }

  function setTheme(themeName) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('pb_theme', themeName);

    // Update active UI selector buttons if present
    document.querySelectorAll('[data-set-theme]').forEach(btn => {
      const active = btn.getAttribute('data-set-theme') === themeName;
      btn.classList.toggle('ring-2', active);
      btn.classList.toggle('ring-indigo-400', active);
      btn.classList.toggle('opacity-100', active);
      btn.classList.toggle('opacity-60', !active);
    });

    if (window.Builder) window.Builder.onCustomizerChange(state);
  }

  function setColorScheme(colorName) {
    state.colorScheme = colorName;
    document.documentElement.setAttribute('data-color', colorName);
    localStorage.setItem('pb_color', colorName);

    document.querySelectorAll('[data-set-color]').forEach(btn => {
      const active = btn.getAttribute('data-set-color') === colorName;
      btn.classList.toggle('ring-2', active);
      btn.classList.toggle('ring-white', active);
      btn.classList.toggle('scale-110', active);
    });

    if (window.updateNeuralCanvasColor) window.updateNeuralCanvasColor();
    if (window.Builder) window.Builder.onCustomizerChange(state);
  }

  function setLanguage(lang) {
    state.language = lang;
    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    localStorage.setItem('pb_lang', lang);

    document.querySelectorAll('[data-set-lang]').forEach(btn => {
      const active = btn.getAttribute('data-set-lang') === lang;
      btn.classList.toggle('bg-white/20', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('opacity-60', !active);
    });

    applyTranslations();
    if (window.Builder) window.Builder.onLanguageChange(lang);
  }

  function applyTranslations() {
    const dict = i18n[state.language] || i18n.ar;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });
  }

  function bindEvents() {
    // Theme buttons
    document.addEventListener('click', e => {
      const themeBtn = e.target.closest('[data-set-theme]');
      if (themeBtn) {
        setTheme(themeBtn.getAttribute('data-set-theme'));
      }

      const colorBtn = e.target.closest('[data-set-color]');
      if (colorBtn) {
        setColorScheme(colorBtn.getAttribute('data-set-color'));
      }

      const langBtn = e.target.closest('[data-set-lang]');
      if (langBtn) {
        setLanguage(langBtn.getAttribute('data-set-lang'));
      }
    });
  }

  return {
    init,
    getState: () => ({ ...state }),
    setTheme,
    setColorScheme,
    setLanguage,
    t: (key) => (i18n[state.language] && i18n[state.language][key]) || i18n.ar[key] || key,
    applyTranslations
  };
})();
