function initWebsiteSimulator() {
  // المنت‌های موردنیاز
  const iframe = document.getElementById('simFrame-website');
  const filterDiv = document.getElementById('filterDiv-website');
  const urlInput = document.getElementById('urlInput-website');
  const iframeContainer = document.getElementById('iframeContainer-website');
  const loading = document.getElementById('loading-website');
  const warningMessage = document.querySelector('.warning-message');
  const radios = document.querySelectorAll('input[name="mode-website"]');
  const loadBtn = document.getElementById('loadBtn-website');

  // بررسی وجود المنت‌ها
  if (!iframe || !filterDiv || !urlInput || !iframeContainer || !loading || !warningMessage || !loadBtn) {
    console.error('یکی از المنت‌های موردنیاز برای شبیه‌ساز وبسایت یافت نشد:', {
      iframe: !!iframe,
      filterDiv: !!filterDiv,
      urlInput: !!urlInput,
      iframeContainer: !!iframeContainer,
      loading: !!loading,
      warningMessage: !!warningMessage,
      loadBtn: !!loadBtn
    });
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = 'خطا: نمی‌توان شبیه‌ساز وبسایت را بارگذاری کرد. لطفاً مطمئن شوید که ساختار HTML درست تنظیم شده است.';
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 10000);
    return;
  }

  // تشخیص دستگاه iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // لیست سایت‌های پیشنهادی
  const suggestedSites = [
    'https://www.google.com',
    'https://www.wikipedia.org',
    'https://www.youtube.com',
    'https://www.amazon.com'
  ];

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `${message}<br><small>ممکن است سایت از iframe پشتیبانی نکند یا محدودیت داشته باشد.</small>`;
    document.body.appendChild(errorDiv);
    warningMessage.style.display = 'block';
    setTimeout(() => errorDiv.remove(), 8000);
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function applyFilter() {
    const selectedMode = document.querySelector('input[name="mode-website"]:checked')?.value || '';
    console.log('اعمال فیلتر:', selectedMode); // برای دیباگ

    // حذف تمام کلاس‌های فیلتر قبلی
    filterDiv.className = 'filterDiv-website';

    // اعمال فیلتر جدید اگر انتخاب شده
    if (selectedMode) {
      const filterClass = isIOS ? `ios-filter-${selectedMode}` : `filter-${selectedMode}`;
      filterDiv.classList.add(filterClass);
      console.log('کلاس فیلتر اضافه شد:', filterClass); // برای دیباگ
    }
  }

  function loadPage() {
    let url = urlInput.value.trim();
    if (!url) {
      showError('لطفاً یک آدرس معتبر وارد کنید.');
      return;
    }

    // تبدیل کلمات کلیدی به آدرس کامل
    if (url === 'google') url = 'https://www.google.com';
    else if (url === 'youtube') url = 'https://www.youtube.com';
    else if (url === 'wikipedia') url = 'https://www.wikipedia.org';
    else if (url === 'amazon') url = 'https://www.amazon.com';

    // افزودن https:// اگر وجود ندارد
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (!isValidUrl(url)) {
      showError('آدرس واردشده معتبر نیست.');
      return;
    }

    loading.style.display = 'block';
    iframeContainer.style.display = 'block';
    warningMessage.style.display = 'none';

    setTimeout(() => {
      iframe.src = url;
      console.log('Iframe src تنظیم شد:', url); // برای دیباگ
    }, 100);

    iframe.onload = () => {
      loading.style.display = 'none';
      applyFilter();
      console.log('Iframe لود شد، فیلتر اعمال شد'); // برای دیباگ
    };

    iframe.onerror = () => {
      showError('نمی‌توان سایت را بارگذاری کرد.');
      loading.style.display = 'none';
      iframeContainer.style.display = 'none';
      console.error('خطا در لود iframe'); // برای دیباگ
    };
  }

  // اضافه کردن event listenerها
  radios.forEach(radio => {
    radio.addEventListener('change', applyFilter);
  });

  urlInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') loadPage();
  });

  loadBtn.addEventListener('click', loadPage);

  // تنظیم placeholder
  urlInput.placeholder = `آدرس صفحه (مثال: ${suggestedSites[0].replace('https://', '')})`;

  // اعمال فیلتر پیش‌فرض
  applyFilter();
}

// اجرای تابع با تأخیر برای سازگاری با لود دینامیک وردپرس/المنتور
function runWebsiteSimulator() {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initWebsiteSimulator();
  } else {
    document.addEventListener('DOMContentLoaded', initWebsiteSimulator);
    // فال‌بک برای وردپرس/المنتور
    setTimeout(() => {
      if (!document.getElementById('simFrame-website')) {
        console.warn('تلاش مجدد برای اجرای شبیه‌ساز وبسایت...');
        initWebsiteSimulator();
      }
    }, 1000);
  }
}

runWebsiteSimulator();