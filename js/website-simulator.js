function initWebsiteSimulator() {
  const iframe = document.getElementById('simFrame-website');
  const urlInput = document.getElementById('urlInput-website');
  const iframeContainer = document.getElementById('iframeContainer-website');
  const loading = document.getElementById('loading-website');
  const warningMessage = document.querySelector('#tool-website-simulator .warning-message');
  const radios = document.querySelectorAll('input[name="mode-website"]');
  const loadBtn = document.getElementById('loadBtn-website');
  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `${message}<br><small>تنظیمات این سایت اجازه دسترسی نمی‌دهد. یک اسکرین‌شات از سایت خود بگیرید و <a href="https://example.com" target="_blank">در این بخش</a> شبیه‌سازی کنید.</small>`;
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
      const selectedMode = document.querySelector('input[name="mode-website"]:checked').value;
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