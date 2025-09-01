document.addEventListener('DOMContentLoaded', () => {
  // المنت‌های موردنیاز
  const imageLoader = document.getElementById('imageLoader-picture');
  const dropArea = document.getElementById('dropArea-picture');
  const mainCanvas = document.getElementById('mainCanvas-picture');
  const ctx = mainCanvas.getContext('2d', { willReadFrequently: true });
  const downloadBtn = document.getElementById('downloadBtn-picture');
  const modeRadios = document.querySelectorAll('input[name="mode-picture"]');
  const sampleImages = document.querySelectorAll('#tool-picture-simulator .sample-img');
  const intensitySlider = document.getElementById('intensity-picture');
  const intensityValue = document.getElementById('intensityValue-picture');
  const loading = document.getElementById('loading-picture');
  let img = new Image();
  let originalImageData = null;

  // ماتریس‌های تبدیل Machado 2009
  const colorTransformMatrices = {
    protanopia: [
      [0.1120, 0.8853, -0.0000],
      [0.1120, 0.8853, -0.0000],
      [0.0045, 0.0300, 0.9662]
    ],
    deuteranopia: [
      [0.2907, 0.7093, -0.0000],
      [0.2907, 0.7093, -0.0000],
      [-0.0213, 0.0528, 0.9662]
    ],
    tritanopia: [
      [0.9718, 0.0262, 0.0000],
      [-0.1526, 1.0008, 0.0548],
      [-0.1526, 1.0008, 0.0548]
    ]
  };

  // بررسی وجود المنت‌ها
  if (!imageLoader || !dropArea || !mainCanvas || !ctx || !downloadBtn || !modeRadios.length || !sampleImages.length || !intensitySlider || !intensityValue || !loading) {
    console.error('خطا: المنت‌های موردنیاز یافت نشدند:', {
      imageLoader: !!imageLoader,
      dropArea: !!dropArea,
      mainCanvas: !!mainCanvas,
      ctx: !!ctx,
      downloadBtn: !!downloadBtn,
      modeRadios: modeRadios.length,
      sampleImages: sampleImages.length,
      intensitySlider: !!intensitySlider,
      intensityValue: !!intensityValue,
      loading: !!loading
    });
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = 'خطا: نمی‌توان شبیه‌ساز تصاویر را بارگذاری کرد. لطفاً صفحه را رفرش کنید.';
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 10000);
    return;
  }

  // تابع تشخیص دستگاه موبایل
  function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  // تابع بهینه‌سازی اندازه تصویر با توجه به جهت‌گیری
  function resizeImage(img, maxWidth = 1500, maxHeight = 1500) {
    let width = img.width;
    let height = img.height;
    let orientation = width >= height ? 'horizontal' : 'vertical';
    console.log(`جهت‌گیری تصویر: ${orientation}, رزولوشن اصلی: ${width}x${height}`);
    
    // تنظیم رزولوشن برای موبایل
    if (isMobileDevice()) {
      if (orientation === 'vertical') {
        // تصویر عمودی: ارتفاع رو به 1500 تنظیم کن
        if (height > maxHeight) {
          width = Math.round((maxHeight / height) * width);
          height = maxHeight;
        }
      } else {
        // تصویر افقی: عرض رو به 1500 تنظیم کن
        if (width > maxWidth) {
          height = Math.round((maxWidth / width) * height);
          width = maxWidth;
        }
      }
    } else {
      // دسکتاپ: رزولوشن اصلی رو حفظ کن
      console.log(`رزولوشن دسکتاپ بدون تغییر: ${width}x${height}`);
    }
    
    console.log(`رزولوشن تصویر تغییر سایز شده: ${width}x${height}`);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(img, 0, 0, width, height);
    return tempCanvas;
  }

  // تابع اعمال فیلتر کوررنگی (برای fallback در iOS)
  function applyColorFilter(imageData, mode, intensity) {
    const data = imageData.data;
    try {
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i] / 255;
        let g = data[i + 1] / 255;
        let b = data[i + 2] / 255;
        let newR, newG, newB;
        if (mode === 'achromatopsia') {
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;
          newR = r + intensity * (gray - r);
          newG = g + intensity * (gray - g);
          newB = b + intensity * (gray - b);
        } else {
          const matrix = colorTransformMatrices[mode];
          newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
          newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
          newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
          newR = r + intensity * (newR - r);
          newG = g + intensity * (newG - g);
          newB = b + intensity * (newB - b);
        }
        data[i] = Math.max(0, Math.min(255, newR * 255));
        data[i + 1] = Math.max(0, Math.min(255, newG * 255));
        data[i + 2] = Math.max(0, Math.min(255, newB * 255));
      }
      return imageData;
    } catch (error) {
      console.error('خطا در اعمال فیلتر کوررنگی:', error);
      throw new Error('خطا در پردازش فیلتر کوررنگی');
    }
  }

  // تابع ایجاد Web Worker
  function createWorker() {
    const workerCode = `
      self.onmessage = function (e) {
        const { imageData, mode, matrices, intensity } = e.data;
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i] / 255;
          let g = data[i + 1] / 255;
          let b = data[i + 2] / 255;
          let newR, newG, newB;
          if (mode === 'achromatopsia') {
            let gray = 0.299 * r + 0.587 * g + 0.114 * b;
            newR = r + intensity * (gray - r);
            newG = g + intensity * (gray - g);
            newB = b + intensity * (gray - b);
          } else {
            const matrix = matrices[mode];
            newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
            newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
            newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
            newR = r + intensity * (newR - r);
            newG = g + intensity * (newG - g);
            newB = b + intensity * (newB - b);
          }
          data[i] = Math.max(0, Math.min(255, newR * 255));
          data[i + 1] = Math.max(0, Math.min(255, newG * 255));
          data[i + 2] = Math.max(0, Math.min(255, newB * 255));
        }
        self.postMessage(imageData);
      };
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
  }

  // تابع بارگذاری تصویر
  function loadImage(src) {
    loading.style.display = 'block';
    img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        const resizedCanvas = resizeImage(img, 1500, 1500);
        mainCanvas.width = resizedCanvas.width;
        mainCanvas.height = resizedCanvas.height;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(resizedCanvas, 0, 0);
        originalImageData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        applySimulation();
        console.log(`تصویر بارگذاری شد با رزولوشن: ${mainCanvas.width}x${mainCanvas.height}`);
        loading.style.display = 'none';
      } catch (error) {
        console.error('خطا در پردازش تصویر:', error);
        alert('خطا در پردازش تصویر. لطفاً تصویر دیگری انتخاب کنید.');
        loading.style.display = 'none';
      }
    };
    img.onerror = function () {
      console.error('خطا در بارگذاری تصویر:', src);
      alert('خطا در بارگذاری تصویر. لطفاً از یک تصویر محلی استفاده کنید یا سرور را برای CORS بررسی کنید.');
      loading.style.display = 'none';
    };
    img.src = src;
  }

  // تابع اعمال شبیه‌سازی
  function applySimulation() {
    if (!originalImageData) {
      console.warn('تصویر اصلی بارگذاری نشده است.');
      return;
    }
    const selectedMode = document.querySelector('input[name="mode-picture"]:checked').value;
    const intensity = parseFloat(intensitySlider.value);
    if (selectedMode === "normal") {
      ctx.putImageData(originalImageData, 0, 0);
      return;
    }
    try {
      const worker = createWorker();
      worker.postMessage({
        imageData: originalImageData,
        mode: selectedMode,
        matrices: colorTransformMatrices,
        intensity
      });
      worker.onmessage = function (e) {
        ctx.putImageData(e.data, 0, 0);
        worker.terminate();
      };
      worker.onerror = function (error) {
        console.warn('خطا در Web Worker، استفاده از رشته اصلی:', error);
        const modifiedImageData = applyColorFilter(
          ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height),
          selectedMode,
          intensity
        );
        ctx.putImageData(modifiedImageData, 0, 0);
      };
    } catch (error) {
      console.warn('ناتوانی در ایجاد Web Worker، استفاده از رشته اصلی:', error);
      const modifiedImageData = applyColorFilter(
        ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height),
        selectedMode,
        intensity
      );
      ctx.putImageData(modifiedImageData, 0, 0);
    }
  }

  // تابع نمایش تصویر اصلی
  function showOriginal() {
    if (!originalImageData) return;
    ctx.putImageData(originalImageData, 0, 0);
  }

  // رویدادهای ورودی فایل
  imageLoader.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.');
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        loadImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // رویدادهای درگ و دراپ
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('active');
  }, { passive: false });
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
  }, { passive: true });
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('active');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function (event) {
        loadImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, { passive: false });
  dropArea.addEventListener('click', () => imageLoader.click());

  // رویدادهای انتخاب حالت
  const savedMode = localStorage.getItem('colorblindMode-picture') || 'normal';
  const selectedRadio = document.querySelector(`input[value="${savedMode}"]`);
  if (selectedRadio) selectedRadio.checked = true;
  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      localStorage.setItem('colorblindMode-picture', radio.value);
      applySimulation();
    });
  });

  // رویدادهای تصاویر نمونه
  sampleImages.forEach(imgElement => {
    imgElement.addEventListener('click', (e) => {
      e.preventDefault();
      const src = imgElement.getAttribute('data-src');
      document.querySelector('input[value="normal"]').checked = true;
      localStorage.setItem('colorblindMode-picture', 'normal');
      loadImage(src);
    });
    imgElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const src = imgElement.getAttribute('data-src');
        document.querySelector('input[value="normal"]').checked = true;
        localStorage.setItem('colorblindMode-picture', 'normal');
        loadImage(src);
      }
    });
  });

  // رویداد اسلایدر شدت
  intensitySlider.addEventListener('input', () => {
    intensityValue.textContent = `${Math.round(intensitySlider.value * 100)}%`;
    applySimulation();
  });

  // رویدادهای لمسی و ماوس
  mainCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showOriginal();
  }, { passive: false });
  mainCanvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    applySimulation();
  }, { passive: false });
  mainCanvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    showOriginal();
  });
  mainCanvas.addEventListener('mouseup', (e) => {
    e.preventDefault();
    applySimulation();
  });
  mainCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

  // دانلود تصویر
  downloadBtn.addEventListener('click', () => {
    if (!img.src) {
      alert('هیچ تصویری بارگذاری نشده است.');
      return;
    }
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    let newWidth, newHeight, quality;
    let orientation = img.width >= img.height ? 'horizontal' : 'vertical';

    if (isMobileDevice()) {
      // دانلود برای موبایل: حداکثر ۲ مگابایت
      const MAX_WIDTH = 1500;
      const MAX_HEIGHT = 1500;
      newWidth = img.width;
      newHeight = img.height;
      if (orientation === 'vertical') {
        if (newHeight > MAX_HEIGHT) {
          newWidth = Math.round((MAX_HEIGHT / newHeight) * newWidth);
          newHeight = MAX_HEIGHT;
        }
      } else {
        if (newWidth > MAX_WIDTH) {
          newHeight = Math.round((MAX_WIDTH / newWidth) * newHeight);
          newWidth = MAX_WIDTH;
        }
      }
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(mainCanvas, 0, 0, newWidth, newHeight);
      quality = 0.95; // کیفیت اولیه بالا برای موبایل
      console.log(`رزولوشن دانلود (موبایل): ${newWidth}x${newHeight}, جهت‌گیری: ${orientation}`);
    } else {
      // دانلود برای دسکتاپ: رزولوشن اصلی و کیفیت 1.0
      newWidth = img.width;
      newHeight = img.height;
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(img, 0, 0);
      const fullImageData = tempCtx.getImageData(0, 0, newWidth, newHeight);
      const selectedMode = document.querySelector('input[name="mode-picture"]:checked').value;
      const intensity = parseFloat(intensitySlider.value);
      quality = 1.0; // حداکثر کیفیت برای دسکتاپ
      if (selectedMode !== "normal") {
        try {
          const worker = createWorker();
          worker.postMessage({
            imageData: fullImageData,
            mode: selectedMode,
            matrices: colorTransformMatrices,
            intensity
          });
          worker.onmessage = function (e) {
            tempCtx.putImageData(e.data, 0, 0);
            worker.terminate();
            continueDownload();
          };
          worker.onerror = function (error) {
            console.warn('خطا در Web Worker برای دانلود، استفاده از رشته اصلی:', error);
            const modifiedImageData = applyColorFilter(fullImageData, selectedMode, intensity);
            tempCtx.putImageData(modifiedImageData, 0, 0);
            continueDownload();
          };
          return;
        } catch (error) {
          console.warn('ناتوانی در ایجاد Web Worker برای دانلود، استفاده از رشته اصلی:', error);
          const modifiedImageData = applyColorFilter(fullImageData, selectedMode, intensity);
          tempCtx.putImageData(modifiedImageData, 0, 0);
        }
      }
    }

    // اضافه کردن واترمارک ساده
    const text = 'koorrangi.ir';
    const fontSize = Math.floor(tempCanvas.width / 30);
    tempCtx.font = `${fontSize}px Vazirmatn, sans-serif`;
    tempCtx.textAlign = 'right';
    tempCtx.textBaseline = 'bottom';
    tempCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    tempCtx.fillText(text, tempCanvas.width - 5, tempCanvas.height - 5);

    // تابع ادامه دانلود
    function continueDownload() {
      try {
        if (isMobileDevice()) {
          // دانلود برای موبایل با toBlob
          let currentQuality = quality;
          const tryDownload = (currentQuality, callback) => {
            tempCanvas.toBlob(
              (blob) => {
                if (!blob) {
                  throw new Error('ناتوانی در ایجاد Blob');
                }
                const sizeMB = blob.size / (1024 * 1024);
                console.log(`حجم فایل (موبایل): ${sizeMB.toFixed(2)}MB با کیفیت ${currentQuality} و رزولوشن ${newWidth}x${newHeight}`);
                if (sizeMB <= 2 || currentQuality <= 0.85) {
                  callback(blob);
                } else {
                  currentQuality = Math.max(0.85, currentQuality - 0.01);
                  tryDownload(currentQuality, callback);
                }
              },
              'image/jpeg',
              currentQuality
            );
          };
          tryDownload(currentQuality, (blob) => {
            const url = URL.createObjectURL(blob);
            downloadImage(url);
          });
        } else {
          // دانلود برای دسکتاپ با toBlob و کیفیت 1.0
          tempCanvas.toBlob(
            (blob) => {
              if (!blob) {
                throw new Error('ناتوانی در ایجاد Blob');
              }
              console.log(`حجم فایل (دسکتاپ): ${(blob.size / (1024 * 1024)).toFixed(2)}MB با کیفیت ${quality} و رزولوشن ${newWidth}x${newHeight}`);
              const url = URL.createObjectURL(blob);
              downloadImage(url);
            },
            'image/jpeg',
            quality
          );
        }
      } catch (error) {
        console.error('خطا در دانلود تصویر:', error);
        alert('خطا در دانلود تصویر. لطفاً تصویر کوچک‌تری انتخاب کنید یا مرورگر را به‌روزرسانی کنید.');
      } finally {
        tempCanvas.remove();
      }
    }

    // تابع دانلود تصویر
    function downloadImage(url) {
      const link = document.createElement('a');
      link.download = 'simulated_image.jpg';
      link.href = url;
      link.click();
      if (!isMobileDevice()) {
        URL.revokeObjectURL(url);
      }
    }

    // اجرای دانلود برای دسکتاپ یا موبایل (اگر فیلتر لازم نبود)
    if (!isMobileDevice() && document.querySelector('input[name="mode-picture"]:checked').value === "normal") {
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(mainCanvas, 0, 0, newWidth, newHeight);
      continueDownload();
    } else if (isMobileDevice()) {
      continueDownload();
    }
  });

  // بارگذاری تصویر اولیه
  const initialImage = "https://www.koorrangi.ir/wp-content/uploads/2025/07/001191fc-4fdb-4f0e-8bb8-4a079a7e8f6a.jpg";
  loadImage(initialImage);
});