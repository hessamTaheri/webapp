document.addEventListener('DOMContentLoaded', initWebsiteSimulator);

function initWebsiteSimulator() {
  const iframe = document.getElementById('simFrame');
  const urlInput = document.getElementById('urlInput');
  const iframeContainer = document.getElementById('iframeContainer');
  const loading = document.getElementById('loading');
  const warningMessage = document.querySelector('.warning-message');
  const radios = document.querySelectorAll('input[name="mode"]');
  const loadBtn = document.getElementById('loadBtn');

  // اگر المنت‌ها وجود ندارند، اجرا نشود
  if (!iframe || !urlInput || !iframeContainer || !loading || !loadBtn) return;

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `${message}<br><small>تنظیمات این سایت اجازه دسترسی نمی‌دهد. یک اسکرین‌شات از سایت خود بگیرید و <a href="https://www.koorrangi.ir/%d8%b4%d8%a8%db%8c%d9%87-%d8%b3%d8%a7%d8%b2-%da%a9%d9%88%d8%b1%d8%b1%d9%86%da%af%db%8c/" target="_blank">در این بخش</a> شبیه‌سازی کنید.</small>`;
    document.body.appendChild(errorDiv);
    warningMessage.style.display = 'block';
    setTimeout(() => errorDiv.remove(), 10000);
  }

  function loadPage() {
    let url = urlInput.value.trim().toLowerCase();
    if (!url) {
      showError('لطفاً یک آدرس وارد کنید.');
      return;
    }

    if (url === 'google') url = 'https://www.google.com';
    else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    loading.style.display = 'block';
    iframeContainer.style.display = 'block';
    warningMessage.style.display = 'none';
    iframe.src = url;

    iframe.onload = () => {
      loading.style.display = 'none';
      iframe.className = '';
      const selectedMode = document.querySelector('input[name="mode"]:checked').value;
      if (selectedMode) iframe.classList.add(`filter-${selectedMode}`);
    };

    iframe.onerror = () => {
      showError('تنظیمات این سایت اجازه دسترسی نمی‌دهد.');
      loading.style.display = 'none';
      iframeContainer.style.display = 'none';
    };
  }

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      iframe.className = '';
      if (radio.value) iframe.classList.add(`filter-${radio.value}`);
    });
  });

  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadPage();
  });

  loadBtn.addEventListener('click', loadPage);
}

// بعد از اینکه ابزار شبیه‌ساز سایت را به صفحه اضافه کردی:
initWebsiteSimulator();

