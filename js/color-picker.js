document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tool-color-picker')) {
    initColorPicker();
  }

  function initColorPicker() {
    // المنت‌های موردنیاز
    const video = document.getElementById('video-color');
    const canvas = document.getElementById('canvas-color');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const magnifierCanvas = document.getElementById('magnifierCanvas-color');
    const magnifierCtx = magnifierCanvas.getContext('2d', { willReadFrequently: true });
    const videoContainer = document.getElementById('videoContainer-color');
    const switchCameraBtn = document.getElementById('switchCameraBtn-color');
    const pauseResumeBtn = document.getElementById('pauseResumeBtn-color');
    const pauseResumeIcon = document.getElementById('pauseResumeIcon-color');
    const playColorBtn = document.getElementById('playColorBtn-color');
    const zoomInBtn = document.getElementById('zoomInBtn-color');
    const zoomOutBtn = document.getElementById('zoomOutBtn-color');
    const brightnessSlider = document.getElementById('brightnessSlider-color');
    const colorNameEl = document.getElementById('colorName-color');
    const hexCodeEl = document.getElementById('hexCode-color');
    const rgbCodeEl = document.getElementById('rgbCode-color');
    const colorBoxEl = document.getElementById('colorBox-color');
    const messageModal = document.getElementById('messageModal-color');
    const modalMessage = document.getElementById('modalMessage-color');
    const closeModalBtn = document.getElementById('closeModalBtn-color');
    const cameraPermissionModal = document.getElementById('cameraPermissionModal');
    const allowCameraBtn = document.getElementById('allowCameraBtn');

    // بررسی وجود المنت‌ها
    if (!video || !canvas || !magnifierCanvas || !videoContainer || !switchCameraBtn ||
        !pauseResumeBtn || !pauseResumeIcon || !playColorBtn || !zoomInBtn ||
        !zoomOutBtn || !brightnessSlider || !colorNameEl || !hexCodeEl ||
        !rgbCodeEl || !colorBoxEl || !messageModal || !modalMessage || !closeModalBtn ||
        !cameraPermissionModal || !allowCameraBtn) {
      console.error('المنت‌های موردنیاز یافت نشد:', {
        video: !!video,
        canvas: !!canvas,
        magnifierCanvas: !!magnifierCanvas,
        videoContainer: !!videoContainer
      });
      showMessage('خطا: نمی‌توان ابزار تشخیص رنگ را بارگذاری کرد.');
      return;
    }

    let currentStream = null;
    let useFrontCamera = false;
    let isPaused = false;
    let currentAudio = null;
    let zoomLevel = 1.0;
    const MAX_ZOOM = 3.0;
    const MIN_ZOOM = 1.0;
    const ZOOM_STEP = 0.2;
    const MAGNIFIER_SIZE = 150;
    const MAGNIFIER_ZOOM = 2;

    // تنظیم اندازه magnifierCanvas
    magnifierCanvas.width = MAGNIFIER_SIZE * window.devicePixelRatio;
    magnifierCanvas.height = MAGNIFIER_SIZE * window.devicePixelRatio;
    magnifierCanvas.style.width = `${MAGNIFIER_SIZE}px`;
    magnifierCanvas.style.height = `${MAGNIFIER_SIZE}px`;
    magnifierCanvas.style.position = 'absolute';
    magnifierCanvas.style.left = '50%';
    magnifierCanvas.style.top = '50%';
    magnifierCanvas.style.transform = 'translate(-50%, -50%)';
    magnifierCanvas.style.pointerEvents = 'none';
    magnifierCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // تابع نمایش پیام
    function showMessage(message) {
      modalMessage.textContent = message;
      messageModal.classList.remove('hidden');
      console.log('پیام:', message);
    }

    // تابع ساخت مسیر صوتی
    const createAudioPath = (persianName) => {
      const sanitizedName = persianName.replace(/ /g, '-');
      return `https://www.koorrangi.ir/wp-content/uploads/2025/08/${sanitizedName}.mp3`;
    };

    // لیست رنگ‌ها (کوتاه شده برای مثال)
    const colors = [
      { name: "آبی آسمانی", hex: "#87CEEB", rgb: [135, 206, 235], audio: createAudioPath("آبی-آسمانی") },
      { name: "آبی تیره", hex: "#00008B", rgb: [0, 0, 139], audio: createAudioPath("آبی-تیره") },
      { name: "قرمز", hex: "#FF0000", rgb: [255, 0, 0], audio: createAudioPath("قرمز") },
      { name: "سبز", hex: "#008000", rgb: [0, 128, 0], audio: createAudioPath("سبز") },
      { name: "سفید", hex: "#FFFFFF", rgb: [255, 255, 255], audio: createAudioPath("سفید") },
      { name: "مشکی", hex: "#000000", rgb: [0, 0, 0], audio: createAudioPath("مشکی") }
    ];

    // تابع بررسی وجود فایل صوتی
    async function checkAudioExists(url) {
      try {
        const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        return response.ok;
      } catch (e) {
        console.error('خطا در بررسی صوت:', url, e);
        return false;
      }
    }

    // تابع پخش صوت
    async function playColorAudio(audioUrl, colorName) {
      if (!audioUrl || colorName === 'در انتظار...') {
        showMessage('لطفاً یک رنگ معتبر انتخاب کنید.');
        return;
      }
      const audioExists = await checkAudioExists(audioUrl);
      if (!audioExists) {
        showMessage(`فایل صوتی برای "${colorName}" یافت نشد.`);
        return;
      }
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = new Audio(audioUrl);
      currentAudio.play().catch(e => showMessage(`خطا در پخش "${colorName}".`));
    }

    // دسترسی به دوربین
    async function getCameraStream() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showMessage('مرورگر شما از دوربین پشتیبانی نمی‌کند.');
        throw new Error('getUserMedia پشتیبانی نمی‌شود');
      }
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      try {
        const constraints = {
          video: {
            facingMode: useFrontCamera ? 'user' : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;
      } catch (err) {
        console.error('خطای دوربین:', err);
        showMessage('دسترسی به دوربین رد شد یا در دسترس نیست.');
        throw err;
      }
    }

    // تبدیل RGB به HSV
    function rgbToHsv(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, v = max;
      const d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [h * 360, s * 100, v * 100];
    }

    // محاسبه فاصله HSV
    function getHsvDistance(hsv1, hsv2) {
      const hDiff = Math.min(Math.abs(hsv1[0] - hsv2[0]), 360 - Math.abs(hsv1[0] - hsv2[0]));
      const sDiff = hsv1[1] - hsv2[1];
      const vDiff = hsv1[2] - hsv2[2];
      return Math.sqrt(hDiff * hDiff + sDiff * sDiff + vDiff * vDiff);
    }

    // محاسبه HSV برای رنگ‌ها
    colors.forEach(color => {
      color.hsv = rgbToHsv(color.rgb[0], color.rgb[1], color.rgb[2]);
    });

    // پیدا کردن نزدیک‌ترین رنگ
    function findClosestColor(r, g, b) {
      const brightnessValue = parseFloat(brightnessSlider.value);
      const normalizedR = Math.min(255, Math.max(0, r / brightnessValue));
      const normalizedG = Math.min(255, Math.max(0, g / brightnessValue));
      const normalizedB = Math.min(255, Math.max(0, b / brightnessValue));
      const inputHsv = rgbToHsv(normalizedR, normalizedG, normalizedB);
      let minDistance = Infinity;
      let closestColor = null;
      for (const color of colors) {
        const distance = getHsvDistance(inputHsv, color.hsv);
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = color;
        }
      }
      return closestColor;
    }

    // رندر فریم‌ها
    function draw() {
      if (!isPaused && video.readyState === video.HAVE_ENOUGH_DATA) {
        // تنظیم اندازه canvas
        const containerWidth = videoContainer.clientWidth;
        const containerHeight = videoContainer.clientHeight;
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        let canvasWidth, canvasHeight;

        if (containerWidth / containerHeight > videoAspectRatio) {
          canvasHeight = containerHeight;
          canvasWidth = canvasHeight * videoAspectRatio;
        } else {
          canvasWidth = containerWidth;
          canvasHeight = canvasWidth / videoAspectRatio;
        }

        // تنظیم canvas با در نظر گرفتن devicePixelRatio
        canvas.width = canvasWidth * window.devicePixelRatio;
        canvas.height = canvasHeight * window.devicePixelRatio;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        video.style.width = `${canvasWidth}px`;
        video.style.height = `${canvasHeight}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // کشیدن تصویر
        ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);

        // محاسبه مختصات مرکز
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        // محاسبه ناحیه ذره‌بین
        const magnifierSize = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;
        const pixelRatio = window.devicePixelRatio;
        const sourceX = (centerX * video.videoWidth / canvasWidth - magnifierSize / 2) * pixelRatio;
        const sourceY = (centerY * video.videoHeight / canvasHeight - magnifierSize / 2) * pixelRatio;

        // کشیدن ذره‌بین
        magnifierCtx.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
        magnifierCtx.drawImage(
          video,
          sourceX,
          sourceY,
          magnifierSize * pixelRatio,
          magnifierSize * pixelRatio,
          0,
          0,
          MAGNIFIER_SIZE,
          MAGNIFIER_SIZE
        );

        // رسم دایره مرکزی
        magnifierCtx.beginPath();
        magnifierCtx.arc(MAGNIFIER_SIZE / 2, MAGNIFIER_SIZE / 2, 5, 0, 2 * Math.PI);
        magnifierCtx.strokeStyle = 'white';
        magnifierCtx.lineWidth = 2;
        magnifierCtx.stroke();

        // برداشت رنگ از مرکز
        const pixel = ctx.getImageData(centerX * pixelRatio, centerY * pixelRatio, 1, 1).data;
        const [r, g, b] = pixel;
        const closestColor = findClosestColor(r, g, b);
        colorNameEl.textContent = closestColor.name;
        hexCodeEl.textContent = closestColor.hex;
        rgbCodeEl.textContent = `RGB(${closestColor.rgb[0]}, ${closestColor.rgb[1]}, ${closestColor.rgb[2]})`;
        colorBoxEl.style.backgroundColor = closestColor.hex;

        // لاگ برای دیباگ
        console.log('رزولوشن ویدیو:', { width: video.videoWidth, height: video.videoHeight });
        console.log('اندازه canvas:', { width: canvasWidth, height: canvasHeight });
        console.log('مختصات مرکز:', { centerX, centerY });
        console.log('مختصات ذره‌بین:', { sourceX, sourceY });
        console.log('رنگ تشخیص داده شده:', closestColor.name, 'RGB:', [r, g, b]);
      }
      requestAnimationFrame(draw);
    }

    // تنظیم روشنایی
    function updateBrightness() {
      const brightnessValue = parseFloat(brightnessSlider.value);
      video.style.filter = `brightness(${brightnessValue}) contrast(1)`;
    }

    // Event Listenerها
    switchCameraBtn.addEventListener('click', async () => {
      useFrontCamera = !useFrontCamera;
      await getCameraStream();
    });

    pauseResumeBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      pauseResumeIcon.classList.toggle('fa-pause', !isPaused);
      pauseResumeIcon.classList.toggle('fa-play', isPaused);
      if (isPaused) video.pause();
      else video.play().catch(() => showMessage('خطا در پخش ویدیو.'));
    });

    playColorBtn.addEventListener('click', () => {
      const currentColorName = colorNameEl.textContent;
      const color = colors.find(c => c.name === currentColorName);
      if (color && currentColorName !== 'در انتظار...') {
        playColorAudio(color.audio, currentColorName);
      } else {
        showMessage('لطفاً یک رنگ معتبر انتخاب کنید.');
      }
    });

    zoomInBtn.addEventListener('click', () => {
      if (zoomLevel < MAX_ZOOM) {
        zoomLevel += ZOOM_STEP;
        magnifierCanvas.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;
      }
    });

    zoomOutBtn.addEventListener('click', () => {
      if (zoomLevel > MIN_ZOOM) {
        zoomLevel -= ZOOM_STEP;
        magnifierCanvas.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;
      }
    });

    brightnessSlider.addEventListener('input', updateBrightness);

    closeModalBtn.addEventListener('click', () => {
      messageModal.classList.add('hidden');
    });

    allowCameraBtn.addEventListener('click', async () => {
      cameraPermissionModal.classList.add('hidden');
      try {
        await getCameraStream();
        video.onloadedmetadata = () => {
          video.play();
          updateBrightness();
          requestAnimationFrame(draw);
        };
      } catch {
        cameraPermissionModal.classList.remove('hidden');
      }
    });

    // مدیریت تغییر جهت صفحه
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        magnifierCanvas.style.left = '50%';
        magnifierCanvas.style.top = '50%';
        magnifierCanvas.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;
      }, 100);
    });

    // شروع اولیه
    colorNameEl.textContent = 'در انتظار...';
    cameraPermissionModal.classList.remove('hidden');
  }
});