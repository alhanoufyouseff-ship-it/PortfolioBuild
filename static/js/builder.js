/**
 * PortfolioBuild - Profile Builder & Live Preview Synchronizer
 * Manages form state, dynamic collections, local uploads, and real-time DOM rendering
 */
const Builder = (function () {
  let profile = {
    id: '',
    name: '',
    photo_path: '',
    bio: '',
    education: '',
    skills: '',
    email: '',
    phone: '',
    linkedin_url: '',
    github_url: '',
    theme: 'modern',
    color_scheme: 'blue-purple',
    language: 'ar',
    projects: [],
    experiences: [],
    certificates: [],
    volunteering: []
  };

  function init() {
    bindFormEvents();
    renderFormCollections();
  }

  function resetProfile() {
    const currentCustom = Customizer.getState();
    profile = {
      id: '',
      name: '',
      photo_path: '',
      bio: '',
      education: '',
      skills: '',
      email: '',
      phone: '',
      linkedin_url: '',
      github_url: '',
      theme: currentCustom.theme || 'modern',
      color_scheme: currentCustom.colorScheme || 'blue-purple',
      language: currentCustom.language || 'ar',
      projects: [],
      experiences: [],
      certificates: [],
      volunteering: []
    };

    populateFormInputs();
    renderFormCollections();
    renderLivePreview();
  }

  function setProfileData(data) {
    profile = { ...profile, ...data };
    populateFormInputs();
    renderFormCollections();
    renderLivePreview();
  }

  function getProfileData() {
    profile.name = document.getElementById('input-name')?.value.trim() || profile.name;
    profile.bio = document.getElementById('input-bio')?.value.trim() || profile.bio;
    profile.education = document.getElementById('input-education')?.value.trim() || profile.education;
    profile.skills = document.getElementById('input-skills')?.value.trim() || profile.skills;
    profile.email = document.getElementById('input-email')?.value.trim() || profile.email;
    profile.phone = document.getElementById('input-phone')?.value.trim() || profile.phone;
    profile.linkedin_url = document.getElementById('input-linkedin')?.value.trim() || profile.linkedin_url;
    profile.github_url = document.getElementById('input-github')?.value.trim() || profile.github_url;

    const customState = Customizer.getState();
    profile.theme = customState.theme;
    profile.color_scheme = customState.colorScheme;
    profile.language = customState.language;

    return profile;
  }

  function populateFormInputs() {
    if (document.getElementById('input-name')) document.getElementById('input-name').value = profile.name || '';
    if (document.getElementById('input-bio')) document.getElementById('input-bio').value = profile.bio || '';
    if (document.getElementById('input-education')) document.getElementById('input-education').value = profile.education || '';
    if (document.getElementById('input-skills')) document.getElementById('input-skills').value = profile.skills || '';
    if (document.getElementById('input-email')) document.getElementById('input-email').value = profile.email || '';
    if (document.getElementById('input-phone')) document.getElementById('input-phone').value = profile.phone || '';
    if (document.getElementById('input-linkedin')) document.getElementById('input-linkedin').value = profile.linkedin_url || '';
    if (document.getElementById('input-github')) document.getElementById('input-github').value = profile.github_url || '';

    // Update avatar preview
    const avatarPreview = document.getElementById('avatar-preview-img');
    if (avatarPreview) {
      if (profile.photo_path) {
        avatarPreview.src = profile.photo_path;
        avatarPreview.classList.remove('opacity-40');
      } else {
        avatarPreview.src = '/static/assets/sample/avatar.svg';
        avatarPreview.classList.add('opacity-40');
      }
    }
  }

  function bindFormEvents() {
    const inputs = [
      'input-name', 'input-bio', 'input-education', 'input-skills',
      'input-email', 'input-phone', 'input-linkedin', 'input-github'
    ];

    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          getProfileData();
          renderLivePreview();
        });
      }
    });

    // Avatar upload handler
    const avatarInput = document.getElementById('avatar-file-input');
    if (avatarInput) {
      avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          await uploadAndSetMedia(file, (url) => {
            profile.photo_path = url;
            const preview = document.getElementById('avatar-preview-img');
            if (preview) {
              preview.src = url;
              preview.classList.remove('opacity-40');
            }
            renderLivePreview();
          });
        }
      });
    }

    // Add buttons
    document.getElementById('btn-add-project')?.addEventListener('click', () => {
      profile.projects.push({
        id: 'proj-' + Date.now(),
        title: '',
        description: '',
        tags: '',
        project_link: '',
        image_path: ''
      });
      renderFormCollections();
      renderLivePreview();
    });

    document.getElementById('btn-add-exp')?.addEventListener('click', () => {
      profile.experiences.push({
        id: 'exp-' + Date.now(),
        title: '',
        company: '',
        duration: '',
        description: ''
      });
      renderFormCollections();
      renderLivePreview();
    });

    document.getElementById('btn-add-cert')?.addEventListener('click', () => {
      profile.certificates.push({
        id: 'cert-' + Date.now(),
        title: '',
        issuer: '',
        year: '',
        image_path: ''
      });
      renderFormCollections();
      renderLivePreview();
    });

    document.getElementById('btn-add-vol')?.addEventListener('click', () => {
      profile.volunteering.push({
        id: 'vol-' + Date.now(),
        role: '',
        organization: '',
        duration: '',
        description: '',
        logo_path: ''
      });
      renderFormCollections();
      renderLivePreview();
    });
  }

  // File Upload Helper
  async function uploadAndSetMedia(file, onSuccess) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (window.App && window.App.showToast) {
        window.App.showToast('جاري رفع الملف محلياً...', 'info');
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      if (result.success) {
        onSuccess(result.url);
        if (window.App && window.App.showToast) {
          window.App.showToast('تم حفظ الملف محلياً بنجاح', 'success');
        }
      } else {
        alert(result.error || 'فشل رفع الملف');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الملف');
    }
  }

  // Render Collection Cards inside Form
  function renderFormCollections() {
    renderProjectsForm();
    renderExperiencesForm();
    renderCertificatesForm();
    renderVolunteeringForm();
  }

  function renderProjectsForm() {
    const container = document.getElementById('projects-form-list');
    if (!container) return;

    if (!profile.projects || profile.projects.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 border border-dashed border-white/10 rounded-xl text-slate-400 text-xs">
          لا توجد مشاريع مضافة بعد. اضغط على زر "إضافة مشروع" للبدء.
        </div>
      `;
      return;
    }

    container.innerHTML = profile.projects.map((proj, idx) => `
      <div class="glass-panel p-4 rounded-xl border border-white/10 space-y-3 relative group" data-proj-id="${proj.id}">
        <button type="button" class="absolute top-3 end-3 text-red-400 hover:text-red-300 transition p-1 text-sm rounded-md bg-red-500/10 hover:bg-red-500/20" onclick="Builder.removeProject(${idx})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <div class="font-semibold text-sm text-indigo-300 flex items-center gap-2">
          <i class="fa-solid fa-folder-open text-xs"></i>
          <span>${Customizer.t('sectionProjects')} #${idx + 1}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelProjectTitle')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value="${escapeHtml(proj.title)}" oninput="Builder.updateProjectField(${idx}, 'title', this.value)">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelProjectTags')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="React, Node.js, AI" value="${escapeHtml(proj.tags)}" oninput="Builder.updateProjectField(${idx}, 'tags', this.value)">
          </div>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelProjectDesc')}</label>
          <textarea rows="2" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" oninput="Builder.updateProjectField(${idx}, 'description', this.value)">${escapeHtml(proj.description)}</textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelProjectLink')}</label>
            <input type="url" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="https://github.com/..." value="${escapeHtml(proj.project_link)}" oninput="Builder.updateProjectField(${idx}, 'project_link', this.value)">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelProjectImage')}</label>
            <div class="flex items-center gap-2">
              <input type="file" accept="image/*" class="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer" onchange="Builder.handleCollectionFileUpload(event, 'projects', ${idx}, 'image_path')">
              ${proj.image_path ? `<img src="${proj.image_path}" class="w-8 h-8 rounded object-cover border border-indigo-500/40">` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderExperiencesForm() {
    const container = document.getElementById('experiences-form-list');
    if (!container) return;

    if (!profile.experiences || profile.experiences.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 border border-dashed border-white/10 rounded-xl text-slate-400 text-xs">
          لا توجد خبرات مضافة بعد. اضغط على زر "إضافة خبرة" للبدء.
        </div>
      `;
      return;
    }

    container.innerHTML = profile.experiences.map((exp, idx) => `
      <div class="glass-panel p-4 rounded-xl border border-white/10 space-y-3 relative group" data-exp-id="${exp.id}">
        <button type="button" class="absolute top-3 end-3 text-red-400 hover:text-red-300 transition p-1 text-sm rounded-md bg-red-500/10 hover:bg-red-500/20" onclick="Builder.removeExperience(${idx})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <div class="font-semibold text-sm text-indigo-300 flex items-center gap-2">
          <i class="fa-solid fa-briefcase text-xs"></i>
          <span>${Customizer.t('sectionExperience')} #${idx + 1}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelExpTitle')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value="${escapeHtml(exp.title)}" oninput="Builder.updateExperienceField(${idx}, 'title', this.value)">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelExpCompany')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value="${escapeHtml(exp.company)}" oninput="Builder.updateExperienceField(${idx}, 'company', this.value)">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelExpDuration')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="2024 - 2025" value="${escapeHtml(exp.duration)}" oninput="Builder.updateExperienceField(${idx}, 'duration', this.value)">
          </div>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelExpDesc')}</label>
          <textarea rows="2" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" oninput="Builder.updateExperienceField(${idx}, 'description', this.value)">${escapeHtml(exp.description)}</textarea>
        </div>
      </div>
    `).join('');
  }

  function renderCertificatesForm() {
    const container = document.getElementById('certificates-form-list');
    if (!container) return;

    if (!profile.certificates || profile.certificates.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 border border-dashed border-white/10 rounded-xl text-slate-400 text-xs">
          لا توجد شهادات مضافة بعد. اضغط على زر "إضافة شهادة" للبدء.
        </div>
      `;
      return;
    }

    container.innerHTML = profile.certificates.map((cert, idx) => `
      <div class="glass-panel p-4 rounded-xl border border-white/10 space-y-3 relative group" data-cert-id="${cert.id}">
        <button type="button" class="absolute top-3 end-3 text-red-400 hover:text-red-300 transition p-1 text-sm rounded-md bg-red-500/10 hover:bg-red-500/20" onclick="Builder.removeCertificate(${idx})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <div class="font-semibold text-sm text-indigo-300 flex items-center gap-2">
          <i class="fa-solid fa-award text-xs"></i>
          <span>${Customizer.t('sectionCertificates')} #${idx + 1}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="md:col-span-2">
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelCertTitle')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value="${escapeHtml(cert.title)}" oninput="Builder.updateCertificateField(${idx}, 'title', this.value)">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelCertYear')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="2025" value="${escapeHtml(cert.year)}" oninput="Builder.updateCertificateField(${idx}, 'year', this.value)">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelCertIssuer')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="AWS, Google, Coursera..." value="${escapeHtml(cert.issuer)}" oninput="Builder.updateCertificateField(${idx}, 'issuer', this.value)">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelCertImage')}</label>
            <div class="flex items-center gap-2">
              <input type="file" accept="image/*" class="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer" onchange="Builder.handleCollectionFileUpload(event, 'certificates', ${idx}, 'image_path')">
              ${cert.image_path ? `<img src="${cert.image_path}" class="w-8 h-8 rounded object-cover border border-indigo-500/40">` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderVolunteeringForm() {
    const container = document.getElementById('volunteering-form-list');
    if (!container) return;

    if (!profile.volunteering || profile.volunteering.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 border border-dashed border-white/10 rounded-xl text-slate-400 text-xs">
          لا توجد أنشطة تطوعية أو نوادي مضافة بعد. اضغط على زر "إضافة نشاط" للبدء.
        </div>
      `;
      return;
    }

    container.innerHTML = profile.volunteering.map((vol, idx) => `
      <div class="glass-panel p-4 rounded-xl border border-white/10 space-y-3 relative group" data-vol-id="${vol.id}">
        <button type="button" class="absolute top-3 end-3 text-red-400 hover:text-red-300 transition p-1 text-sm rounded-md bg-red-500/10 hover:bg-red-500/20" onclick="Builder.removeVolunteering(${idx})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <div class="font-semibold text-sm text-indigo-300 flex items-center gap-2">
          <i class="fa-solid fa-users text-xs"></i>
          <span>${Customizer.t('sectionVolunteering')} #${idx + 1}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelVolRole')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value="${escapeHtml(vol.role)}" oninput="Builder.updateVolunteeringField(${idx}, 'role', this.value)">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelVolOrg')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" value="${escapeHtml(vol.organization)}" oninput="Builder.updateVolunteeringField(${idx}, 'organization', this.value)">
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelVolDuration')}</label>
            <input type="text" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="2024 - 2025" value="${escapeHtml(vol.duration)}" oninput="Builder.updateVolunteeringField(${idx}, 'duration', this.value)">
          </div>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelVolDesc')}</label>
          <textarea rows="2" class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" oninput="Builder.updateVolunteeringField(${idx}, 'description', this.value)">${escapeHtml(vol.description)}</textarea>
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">${Customizer.t('labelVolLogo')}</label>
          <div class="flex items-center gap-2">
            <input type="file" accept="image/*" class="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer" onchange="Builder.handleCollectionFileUpload(event, 'volunteering', ${idx}, 'logo_path')">
            ${vol.logo_path ? `<img src="${vol.logo_path}" class="w-8 h-8 rounded object-cover border border-indigo-500/40">` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  // ----------------- PORTFOLIO HTML MARKUP GENERATOR ----------------- //

  function generatePortfolioMarkup(data) {
    const isAr = (data.language || 'ar') === 'ar';
    const skillsList = (data.skills || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const hasBioOrName = data.name || data.bio || data.education;

    return `
      <div class="w-full max-w-5xl mx-auto space-y-12 pb-16">
        <!-- Hero Section -->
        <header class="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden border border-white/10 glow-card">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="relative shrink-0">
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-indigo-400/50 shadow-2xl bg-slate-900 flex items-center justify-center">
                ${data.photo_path 
                  ? `<img src="${data.photo_path}" alt="${escapeHtml(data.name)}" class="w-full h-full object-cover">`
                  : `<div class="text-4xl font-bold text-gradient"><i class="fa-solid fa-code"></i></div>`
                }
              </div>
            </div>
            <div class="space-y-4 text-center md:text-start flex-1">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-tag text-xs font-semibold">
                <i class="fa-solid fa-graduation-cap"></i>
                <span>${escapeHtml(data.education) || (isAr ? 'طالب جامعي / مهندس برمجيات' : 'Computer Science / Engineering Student')}</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-black tracking-tight text-white">
                ${escapeHtml(data.name) || (isAr ? 'اسمك هنا' : 'Your Name Here')}
              </h1>
              <p class="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                ${escapeHtml(data.bio) || (isAr ? 'اكتب نبذتك التعريفية وخبراتك البرمجية لتظهر هنا بشكل أنيق وجذاب...' : 'Your professional summary and tech passion will be displayed here...')}
              </p>
              <!-- Quick Contact Links in Hero -->
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                ${data.linkedin_url ? `
                  <a href="${data.linkedin_url}" target="_blank" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition flex items-center gap-2">
                    <i class="fa-brands fa-linkedin text-indigo-400 text-sm"></i>
                    <span>LinkedIn</span>
                  </a>
                ` : ''}
                ${data.github_url ? `
                  <a href="${data.github_url}" target="_blank" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition flex items-center gap-2">
                    <i class="fa-brands fa-github text-indigo-400 text-sm"></i>
                    <span>GitHub</span>
                  </a>
                ` : ''}
                ${data.email ? `
                  <a href="mailto:${data.email}" class="px-4 py-2 rounded-lg bg-gradient-primary text-white text-xs font-medium glow-btn flex items-center gap-2">
                    <i class="fa-solid fa-paper-plane text-xs"></i>
                    <span>${isAr ? 'تواصل معي' : 'Contact Me'}</span>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        </header>

        <!-- Technical Skills Section -->
        ${skillsList.length > 0 ? `
          <section class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm">
                <i class="fa-solid fa-layer-group"></i>
              </div>
              <h2 class="text-xl font-bold text-white tracking-wide">${isAr ? 'المهارات التقنية' : 'Technical Arsenal'}</h2>
            </div>
            <div class="glass-panel p-6 rounded-2xl border border-white/10">
              <div class="flex flex-wrap gap-2.5">
                ${skillsList.map(skill => `
                  <span class="badge-tag px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                    <i class="fa-solid fa-code text-[10px] opacity-70"></i>
                    <span>${escapeHtml(skill)}</span>
                  </span>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- Featured Projects Section -->
        ${data.projects && data.projects.length > 0 ? `
          <section class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm">
                <i class="fa-solid fa-cubes"></i>
              </div>
              <h2 class="text-xl font-bold text-white tracking-wide">${isAr ? 'المشاريع والأعمال المميزة' : 'Featured Projects'}</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${data.projects.map(proj => `
                <div class="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col glow-card group">
                  <div class="w-full h-44 bg-slate-900 relative overflow-hidden border-b border-white/10">
                    ${proj.image_path 
                      ? `<img src="${proj.image_path}" alt="${escapeHtml(proj.title)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">`
                      : `<div class="w-full h-full flex items-center justify-center text-3xl text-slate-700"><i class="fa-solid fa-laptop-code"></i></div>`
                    }
                  </div>
                  <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div class="space-y-2">
                      <h3 class="font-bold text-base text-white group-hover:text-indigo-300 transition">
                        ${escapeHtml(proj.title) || (isAr ? 'مشروع بدون عنوان' : 'Untitled Project')}
                      </h3>
                      <p class="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        ${escapeHtml(proj.description) || (isAr ? 'تفاصيل المشروع...' : 'Project description...')}
                      </p>
                    </div>
                    
                    <div class="space-y-4">
                      ${proj.tags ? `
                        <div class="flex flex-wrap gap-1.5">
                          ${proj.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => `
                            <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-indigo-300 border border-white/5 font-mono">
                              ${escapeHtml(tag)}
                            </span>
                          `).join('')}
                        </div>
                      ` : ''}

                      ${proj.project_link ? `
                        <a href="${proj.project_link}" target="_blank" class="w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition flex items-center justify-center gap-2">
                          <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                          <span>${Customizer.t('viewDemoBtn')}</span>
                        </a>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Grid for Experience & Certificates -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Work Experience -->
          ${data.experiences && data.experiences.length > 0 ? `
            <section class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm">
                  <i class="fa-solid fa-briefcase"></i>
                </div>
                <h2 class="text-xl font-bold text-white tracking-wide">${isAr ? 'الخبرات العملية والتدريب' : 'Experience & Internships'}</h2>
              </div>
              <div class="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                ${data.experiences.map((exp, i) => `
                  <div class="relative ${i < data.experiences.length - 1 ? 'pb-6 border-b border-white/5' : ''}">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="font-bold text-sm text-white">${escapeHtml(exp.title)}</h3>
                      <span class="text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono">${escapeHtml(exp.duration)}</span>
                    </div>
                    <div class="text-xs font-semibold text-indigo-300 mt-0.5">${escapeHtml(exp.company)}</div>
                    <p class="text-xs text-slate-300 mt-2 leading-relaxed">${escapeHtml(exp.description)}</p>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Certificates -->
          ${data.certificates && data.certificates.length > 0 ? `
            <section class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm">
                  <i class="fa-solid fa-award"></i>
                </div>
                <h2 class="text-xl font-bold text-white tracking-wide">${isAr ? 'الشهادات والاعتمادات' : 'Certifications'}</h2>
              </div>
              <div class="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                ${data.certificates.map(cert => `
                  <div class="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition">
                    <div class="w-12 h-12 rounded-lg bg-slate-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      ${cert.image_path 
                        ? `<img src="${cert.image_path}" class="w-full h-full object-cover">`
                        : `<i class="fa-solid fa-certificate text-indigo-400 text-base"></i>`
                      }
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-xs md:text-sm text-white truncate">${escapeHtml(cert.title)}</h3>
                      <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span class="text-indigo-300">${escapeHtml(cert.issuer)}</span>
                        ${cert.year ? `<span>•</span><span>${escapeHtml(cert.year)}</span>` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>

        <!-- Volunteering & Student Clubs (Placed at the end before Contact as per PRD) -->
        ${data.volunteering && data.volunteering.length > 0 ? `
          <section class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm">
                <i class="fa-solid fa-users"></i>
              </div>
              <h2 class="text-xl font-bold text-white tracking-wide">${isAr ? 'الأنشطة التطوعية والنوادي الطلابية' : 'Volunteering & Student Clubs'}</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.volunteering.map(vol => `
                <div class="glass-panel p-6 rounded-2xl border border-white/10 flex items-start gap-4 glow-card">
                  <div class="w-14 h-14 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    ${vol.logo_path 
                      ? `<img src="${vol.logo_path}" class="w-full h-full object-cover">`
                      : `<i class="fa-solid fa-hands-holding-circle text-indigo-400 text-xl"></i>`
                    }
                  </div>
                  <div class="flex-1 space-y-1.5 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="font-bold text-sm text-white truncate">${escapeHtml(vol.role)}</h3>
                      <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 shrink-0 font-mono">${escapeHtml(vol.duration)}</span>
                    </div>
                    <div class="text-xs font-semibold text-indigo-300">${escapeHtml(vol.organization)}</div>
                    <p class="text-xs text-slate-300 leading-relaxed pt-1">${escapeHtml(vol.description)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Contact Section -->
        <footer class="glass-panel rounded-2xl p-8 md:p-10 border border-white/10 text-center space-y-6">
          <div class="max-w-md mx-auto space-y-2">
            <h2 class="text-2xl font-black text-white">${Customizer.t('contactHeading')}</h2>
            <p class="text-xs md:text-sm text-slate-300">${Customizer.t('getInTouch')}</p>
          </div>
          
          <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
            ${data.email ? `
              <a href="mailto:${data.email}" class="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition flex items-center gap-2.5 glow-btn">
                <i class="fa-solid fa-envelope text-indigo-400"></i>
                <span>${escapeHtml(data.email)}</span>
              </a>
            ` : ''}
            ${data.phone ? `
              <a href="tel:${data.phone}" class="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition flex items-center gap-2.5 glow-btn">
                <i class="fa-solid fa-phone text-emerald-400"></i>
                <span>${escapeHtml(data.phone)}</span>
              </a>
            ` : ''}
            ${data.linkedin_url ? `
              <a href="${data.linkedin_url}" target="_blank" class="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition flex items-center gap-2.5 glow-btn">
                <i class="fa-brands fa-linkedin text-sky-400"></i>
                <span>LinkedIn</span>
              </a>
            ` : ''}
            ${data.github_url ? `
              <a href="${data.github_url}" target="_blank" class="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition flex items-center gap-2.5 glow-btn">
                <i class="fa-brands fa-github text-purple-400"></i>
                <span>GitHub</span>
              </a>
            ` : ''}
          </div>
        </footer>
      </div>
    `;
  }

  function renderLivePreview() {
    const previewRoot = document.getElementById('live-portfolio-preview');
    if (!previewRoot) return;
    const data = getProfileData();
    previewRoot.innerHTML = generatePortfolioMarkup(data);
  }

  // ----------------- FIELD UPDATE HANDLERS ----------------- //

  function updateProjectField(index, field, value) {
    if (profile.projects[index]) {
      profile.projects[index][field] = value;
      renderLivePreview();
    }
  }

  function removeProject(index) {
    profile.projects.splice(index, 1);
    renderProjectsForm();
    renderLivePreview();
  }

  function updateExperienceField(index, field, value) {
    if (profile.experiences[index]) {
      profile.experiences[index][field] = value;
      renderLivePreview();
    }
  }

  function removeExperience(index) {
    profile.experiences.splice(index, 1);
    renderExperiencesForm();
    renderLivePreview();
  }

  function updateCertificateField(index, field, value) {
    if (profile.certificates[index]) {
      profile.certificates[index][field] = value;
      renderLivePreview();
    }
  }

  function removeCertificate(index) {
    profile.certificates.splice(index, 1);
    renderCertificatesForm();
    renderLivePreview();
  }

  function updateVolunteeringField(index, field, value) {
    if (profile.volunteering[index]) {
      profile.volunteering[index][field] = value;
      renderLivePreview();
    }
  }

  function removeVolunteering(index) {
    profile.volunteering.splice(index, 1);
    renderVolunteeringForm();
    renderLivePreview();
  }

  async function handleCollectionFileUpload(event, collectionName, index, fieldName) {
    const file = event.target.files[0];
    if (!file) return;

    await uploadAndSetMedia(file, (url) => {
      if (profile[collectionName] && profile[collectionName][index]) {
        profile[collectionName][index][fieldName] = url;
        renderFormCollections();
        renderLivePreview();
      }
    });
  }

  function onCustomizerChange(state) {
    profile.theme = state.theme;
    profile.color_scheme = state.colorScheme;
    profile.language = state.language;
    renderLivePreview();
  }

  function onLanguageChange(lang) {
    profile.language = lang;
    renderFormCollections();
    renderLivePreview();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return {
    init,
    resetProfile,
    setProfileData,
    getProfileData,
    generatePortfolioMarkup,
    renderLivePreview,
    updateProjectField,
    removeProject,
    updateExperienceField,
    removeExperience,
    updateCertificateField,
    removeCertificate,
    updateVolunteeringField,
    removeVolunteering,
    handleCollectionFileUpload,
    onCustomizerChange,
    onLanguageChange
  };
})();
