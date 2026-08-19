/**
 * PortfolioBuild - Main Application Controller
 * Handles view routing, example loading, publishing flow, and confetti celebration
 */
const App = (function () {
  let activeView = 'welcome'; // 'welcome' | 'builder' | 'example'
  let publishedUrl = '';

  function init() {
    Customizer.init();
    Builder.init();
    bindGlobalEvents();
  }

  function showView(viewName) {
    activeView = viewName;
    const welcomeEl = document.getElementById('view-welcome');
    const builderEl = document.getElementById('view-builder');
    const exampleEl = document.getElementById('view-example');

    if (welcomeEl) welcomeEl.classList.toggle('hidden', viewName !== 'welcome');
    if (builderEl) builderEl.classList.toggle('hidden', viewName !== 'builder');
    if (exampleEl) exampleEl.classList.toggle('hidden', viewName !== 'example');

    if (viewName === 'builder') {
      Builder.renderLivePreview();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startFreshBuilder() {
    Builder.resetProfile();
    showView('builder');
  }

  async function loadExamplePortfolio() {
    try {
      showToast('جاري تحميل النموذج التجريبي...', 'info');
      const lang = Customizer.getState().language;
      const res = await fetch(`/api/example?lang=${lang}`);
      const data = await res.json();

      if (data.success) {
        const exampleData = {
          ...data.user,
          projects: data.projects || [],
          experiences: data.experiences || [],
          certificates: data.certificates || [],
          volunteering: data.volunteering || []
        };

        const renderContainer = document.getElementById('example-portfolio-render');
        if (renderContainer) {
          renderContainer.innerHTML = Builder.generatePortfolioMarkup(exampleData);
        }

        if (data.user.theme) Customizer.setTheme(data.user.theme);
        if (data.user.color_scheme) Customizer.setColorScheme(data.user.color_scheme);

        showView('example');
        showToast('تم فتح النموذج التجريبي (للعرض فقط)', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('تعذر تحميل النموذج التجريبي', 'error');
    }
  }

  async function publishPortfolio() {
    const data = Builder.getProfileData();

    if (!data.name || data.name.trim() === '') {
      showToast('يرجى كتابة الاسم الكامل أولاً', 'error');
      document.getElementById('input-name')?.focus();
      return;
    }

    const publishBtn = document.getElementById('btn-publish-main');
    const originalText = publishBtn?.innerHTML;
    if (publishBtn) {
      publishBtn.disabled = true;
      publishBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${Customizer.t('btnPublishing')}</span>`;
    }

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        publishedUrl = window.location.origin + result.share_url;
        openPublishModal(publishedUrl);
        triggerConfettiCelebration();
      } else {
        showToast(result.error || 'فشل في عملية النشر', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ في الاتصال بالسيرفر أثناء النشر', 'error');
    } finally {
      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.innerHTML = originalText;
      }
    }
  }

  function triggerConfettiCelebration() {
    if (typeof confetti === 'function') {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }

  function openPublishModal(url) {
    const modal = document.getElementById('publish-modal');
    const linkInput = document.getElementById('publish-share-url');
    const openBtn = document.getElementById('btn-open-live-portfolio');
    const qrContainer = document.getElementById('publish-qr-code');

    if (!modal) return;

    if (linkInput) linkInput.value = url;
    if (openBtn) openBtn.href = url;

    if (qrContainer) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&bgcolor=0f172a&color=38bdf8&margin=1`;
      qrContainer.innerHTML = `<img src="${qrUrl}" alt="QR Code" class="w-28 h-28 rounded-lg border border-indigo-500/30 p-1 bg-slate-900">`;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function closePublishModal() {
    const modal = document.getElementById('publish-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  function copyPublishedLink() {
    const linkInput = document.getElementById('publish-share-url');
    if (linkInput) {
      navigator.clipboard.writeText(linkInput.value).then(() => {
        showToast(Customizer.t('copiedText'), 'success');
      });
    }
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconClass = 'fa-circle-info text-sky-400';
    if (type === 'success') iconClass = 'fa-circle-check text-emerald-400';
    if (type === 'error') iconClass = 'fa-triangle-exclamation text-rose-400';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} text-lg"></i>
      <span class="text-sm font-medium">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function bindGlobalEvents() {
    // Welcome CTA: Start Builder (Clean and Empty)
    document.getElementById('btn-welcome-create')?.addEventListener('click', () => {
      startFreshBuilder();
    });

    // Welcome CTA: Example Portfolio (Read-Only)
    document.getElementById('btn-welcome-example')?.addEventListener('click', () => {
      loadExamplePortfolio();
    });

    // Example View: Back to Home
    document.getElementById('btn-example-back')?.addEventListener('click', () => {
      showView('welcome');
    });

    // Example View: Start creating own profile
    document.getElementById('btn-example-create')?.addEventListener('click', () => {
      startFreshBuilder();
    });

    // Navbar Back to Home
    document.getElementById('btn-nav-home')?.addEventListener('click', () => {
      showView('welcome');
    });

    // Navbar Load Example
    document.getElementById('btn-nav-example')?.addEventListener('click', () => {
      loadExamplePortfolio();
    });

    // LinkedIn Quick Sync CTA
    document.getElementById('btn-sync-linkedin')?.addEventListener('click', () => {
      LinkedInSync.startSync((importedData) => {
        Builder.setProfileData(importedData);
      });
    });

    // Publish buttons
    document.getElementById('btn-publish-main')?.addEventListener('click', () => {
      publishPortfolio();
    });

    // Publish Modal actions
    document.getElementById('btn-copy-share-url')?.addEventListener('click', copyPublishedLink);
    document.getElementById('btn-close-publish-modal')?.addEventListener('click', closePublishModal);

    // Tab switching (Mobile / Desktop Builder vs Preview Tabs)
    const tabBuilder = document.getElementById('tab-btn-builder');
    const tabPreview = document.getElementById('tab-btn-preview');
    const colBuilder = document.getElementById('col-builder-form');
    const colPreview = document.getElementById('col-builder-preview');

    if (tabBuilder && tabPreview && colBuilder && colPreview) {
      tabBuilder.addEventListener('click', () => {
        tabBuilder.classList.add('bg-indigo-600', 'text-white');
        tabBuilder.classList.remove('bg-white/5', 'text-slate-400');
        tabPreview.classList.remove('bg-indigo-600', 'text-white');
        tabPreview.classList.add('bg-white/5', 'text-slate-400');

        colBuilder.classList.remove('hidden');
        colPreview.classList.add('hidden', 'lg:block');
      });

      tabPreview.addEventListener('click', () => {
        tabPreview.classList.add('bg-indigo-600', 'text-white');
        tabPreview.classList.remove('bg-white/5', 'text-slate-400');
        tabBuilder.classList.remove('bg-indigo-600', 'text-white');
        tabBuilder.classList.add('bg-white/5', 'text-slate-400');

        colPreview.classList.remove('hidden');
        colBuilder.classList.add('hidden');
      });
    }
  }

  return {
    init,
    showView,
    startFreshBuilder,
    loadExamplePortfolio,
    publishPortfolio,
    showToast
  };
})();

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
