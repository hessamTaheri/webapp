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

  // بررسی وجود المنت‌ها
  if (!video || !canvas || !magnifierCanvas || !videoContainer || !switchCameraBtn ||
      !pauseResumeBtn || !pauseResumeIcon || !playColorBtn || !zoomInBtn ||
      !zoomOutBtn || !brightnessSlider || !colorNameEl || !hexCodeEl ||
      !rgbCodeEl || !colorBoxEl || !messageModal || !modalMessage || !closeModalBtn) {
    console.error('یکی از المنت‌های موردنیاز برای تشخیص رنگ یافت نشد:', {
      video: !!video,
      canvas: !!canvas,
      magnifierCanvas: !!magnifierCanvas,
      videoContainer: !!videoContainer,
      switchCameraBtn: !!switchCameraBtn,
      pauseResumeBtn: !!pauseResumeBtn,
      pauseResumeIcon: !!pauseResumeIcon,
      playColorBtn: !!playColorBtn,
      zoomInBtn: !!zoomInBtn,
      zoomOutBtn: !!zoomOutBtn,
      brightnessSlider: !!brightnessSlider,
      colorNameEl: !!colorNameEl,
      hexCodeEl: !!hexCodeEl,
      rgbCodeEl: !!rgbCodeEl,
      colorBoxEl: !!colorBoxEl,
      messageModal: !!messageModal,
      modalMessage: !!modalMessage,
      closeModalBtn: !!closeModalBtn
    });
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = 'خطا: نمی‌توان ابزار تشخیص رنگ را بارگذاری کرد. لطفاً مطمئن شوید که ساختار HTML درست تنظیم شده است.';
    document.getElementById('tool-color-picker').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 10000);
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
  const BASE_MAGNIFIER_ZOOM = 2;
  const COLOR_DISTANCE_THRESHOLD = 30;
  const AUDIO_BASE_URL = 'https://www.koorrangi.ir/wp-content/uploads/2025/08/';

  // تنظیم اندازه اولیه magnifierCanvas
  magnifierCanvas.width = MAGNIFIER_SIZE;
  magnifierCanvas.height = MAGNIFIER_SIZE;
  magnifierCanvas.style.width = `${MAGNIFIER_SIZE}px`;
  magnifierCanvas.style.height = `${MAGNIFIER_SIZE}px`;
magnifierCanvas.style.transform = "translate(-50%, -50%) scale(1)";

  // تابع نمایش پیام خطا
  function showMessage(message) {
    modalMessage.textContent = message;
    messageModal.classList.remove('hidden');
    console.log('پیام نمایش داده شد:', message);
  }

  // تابع ساخت مسیر فایل صوتی
  const createAudioPath = (persianName) => {
    const sanitizedName = persianName.replace(/ /g, '-');
    return `${AUDIO_BASE_URL}${sanitizedName}.mp3`;
  };

  // لیست رنگ‌ها
  const colors = [
    { name: "آبی آسمانی", hex: "#87CEEB", rgb: [135, 206, 235], audio: createAudioPath("آبی-آسمانی") },
    { name: "آبی تیره", hex: "#00008B", rgb: [0, 0, 139], audio: createAudioPath("آبی-تیره") },
    { name: "آبی روشن", hex: "#ADD8E6", rgb: [173, 216, 230], audio: createAudioPath("آبی-روشن") },
    { name: "آبی سبز", hex: "#00CED1", rgb: [0, 206, 209], audio: createAudioPath("آبی-سبز") },
    { name: "آبی کبریتی", hex: "#3A5FCD", rgb: [58, 95, 205], audio: createAudioPath("آبی-کبریتی") },
    { name: "آبی لاجوردی", hex: "#273A87", rgb: [39, 58, 135], audio: createAudioPath("آبی-لاجوردی") },
    { name: "آبی مایل به بنفش", hex: "#8A2BE2", rgb: [138, 43, 226], audio: createAudioPath("آبی-مایل-به-بنفش") },
    { name: "آبی نفتی", hex: "#191970", rgb: [25, 25, 112], audio: createAudioPath("آبی-نفتی") },
    { name: "آبی نیلی", hex: "#4B0082", rgb: [75, 0, 130], audio: createAudioPath("آبی-نیلی") },
    { name: "اخرایی", hex: "#CC7722", rgb: [204, 119, 34], audio: createAudioPath("اخرایی") },
    { name: "ارغوانی", hex: "#9932CC", rgb: [153, 50, 204], audio: createAudioPath("ارغوانی") },
    { name: "ارغوانی تیره", hex: "#800080", rgb: [128, 0, 128], audio: createAudioPath("ارغوانی-تیره") },
    { name: "ارغوانی روشن", hex: "#E6E6FA", rgb: [230, 230, 250], audio: createAudioPath("ارغوانی-روشن") },
    { name: "بژ", hex: "#F5F5DC", rgb: [245, 245, 220], audio: createAudioPath("بژ") },
    { name: "بنفش", hex: "#6A0DAD", rgb: [106, 13, 173], audio: createAudioPath("بنفش") },
    { name: "بنفش روشن", hex: "#DDA0DD", rgb: [221, 160, 221], audio: createAudioPath("بنفش-روشن") },
    { name: "بنفش یاسی", hex: "#C8A2C8", rgb: [200, 162, 200], audio: createAudioPath("بنفش-یاسی") },
    { name: "بیسکوییتی", hex: "#F5DEB3", rgb: [245, 222, 179], audio: createAudioPath("بیسکوییتی") },
    { name: "صورتی", hex: "#FFC0CB", rgb: [255, 192, 203], audio: createAudioPath("صورتی") },
    { name: "خاکستری تیره", hex: "#696969", rgb: [105, 105, 105], audio: createAudioPath("خاکستری-تیره") },
    { name: "خاکستری روشن", hex: "#D3D3D3", rgb: [211, 211, 211], audio: createAudioPath("خاکستری-روشن") },
    { name: "خاکستری", hex: "#808080", rgb: [128, 128, 128], audio: createAudioPath("خاکستری") },
    { name: "خاکی", hex: "#C3B091", rgb: [195, 176, 145], audio: createAudioPath("خاکی") },
    { name: "خردلی", hex: "#FFDB58", rgb: [255, 219, 88], audio: createAudioPath("خردلی") },
    { name: "خرمایی", hex: "#8B4513", rgb: [139, 69, 19], audio: createAudioPath("خرمایی") },
    { name: "زرد", hex: "#FFFF00", rgb: [255, 255, 0], audio: createAudioPath("زرد") },
    { name: "زرد روشن", hex: "#FFFFE0", rgb: [255, 255, 224], audio: createAudioPath("زرد-روشن") },
    { name: "زرد قناری", hex: "#FFEF00", rgb: [255, 239, 0], audio: createAudioPath("زرد-قناری") },
    { name: "زرشکی", hex: "#DC143C", rgb: [220, 20, 60], audio: createAudioPath("زرشکی") },
    { name: "سبز ارتشی", hex: "#4B5320", rgb: [75, 83, 32], audio: createAudioPath("سبز-ارتشی") },
    { name: "سبز پسته ای", hex: "#93C572", rgb: [147, 197, 114], audio: createAudioPath("سبز-پسته-ای") },
    { name: "سبز تیره", hex: "#006400", rgb: [0, 100, 0], audio: createAudioPath("سبز-تیره") },
    { name: "سبز چمنی", hex: "#7CFC00", rgb: [124, 252, 0], audio: createAudioPath("سبز-چمنی") },
    { name: "سبز دریایی", hex: "#20B2AA", rgb: [32, 178, 170], audio: createAudioPath("سبز-دریایی") },
    { name: "سبز روشن", hex: "#90EE90", rgb: [144, 238, 144], audio: createAudioPath("سبز-روشن") },
    { name: "سبز زیتونی", hex: "#6B8E23", rgb: [107, 142, 35], audio: createAudioPath("سبز-زیتونی") },
    { name: "سبز کاهویی", hex: "#ADFF2F", rgb: [173, 255, 47], audio: createAudioPath("سبز-کاهویی") },
    { name: "سبز مریم گلی", hex: "#B2AC88", rgb: [178, 172, 136], audio: createAudioPath("سبز-مریم-گلی") },
    { name: "سبز یشمی", hex: "#00A693", rgb: [0, 166, 147], audio: createAudioPath("سبز-یشمی") },
    { name: "سبز", hex: "#008000", rgb: [0, 128, 0], audio: createAudioPath("سبز") },
    { name: "سفید", hex: "#FFFFFF", rgb: [255, 255, 255], audio: createAudioPath("سفید") },
    { name: "سرمه ای", hex: "#000080", rgb: [0, 0, 128], audio: createAudioPath("سرمه-ای") },
    { name: "شکلاتی", hex: "#D2691E", rgb: [210, 105, 30], audio: createAudioPath("شکلاتی") },
    { name: "صورتی کمرنگ", hex: "#FFB6C1", rgb: [255, 182, 193], audio: createAudioPath("صورتی-کمرنگ") },
    { name: "طلایی", hex: "#FFD700", rgb: [255, 215, 0], audio: createAudioPath("طلایی") },
    { name: "عسلی", hex: "#DDA0DD", rgb: [221, 160, 221], audio: createAudioPath("عسلی") },
    { name: "عنابی", hex: "#B33B33", rgb: [179, 59, 51], audio: createAudioPath("عنابی") },
    { name: "فیروزه ای", hex: "#40E0D0", rgb: [64, 224, 208], audio: createAudioPath("فیروزه-ای") },
    { name: "قرمز", hex: "#FF0000", rgb: [255, 0, 0], audio: createAudioPath("قرمز") },
    { name: "قرمز آلبالویی", hex: "#8B0000", rgb: [139, 0, 0], audio: createAudioPath("قرمز-آلبالویی") },
    { name: "قرمز روشن", hex: "#FF6666", rgb: [255, 102, 102], audio: createAudioPath("قرمز-روشن") },
    { name: "قرمز شرابی", hex: "#800000", rgb: [128, 0, 0], audio: createAudioPath("قرمز-شرابی") },
    { name: "قرمز گوجه ای", hex: "#FF6347", rgb: [255, 99, 71], audio: createAudioPath("قرمز-گوجه-ای") },
    { name: "قهوه ای", hex: "#A52A2A", rgb: [165, 42, 42], audio: createAudioPath("قهوه-ای") },
    { name: "قهوه ای تیره", hex: "#5C4033", rgb: [92, 64, 51], audio: createAudioPath("قهوه-ای-تیره") },
    { name: "کرم", hex: "#FFF8DC", rgb: [255, 248, 220], audio: createAudioPath("کرم") },
    { name: "مسی", hex: "#B87333", rgb: [184, 115, 51], audio: createAudioPath("مسی") },
    { name: "مشکی", hex: "#000000", rgb: [0, 0, 0], audio: createAudioPath("مشکی") },
    { name: "نارنجی", hex: "#FFA500", rgb: [255, 165, 0], audio: createAudioPath("نارنجی") },
    { name: "نارنجی تیره", hex: "#FF8C00", rgb: [255, 140, 0], audio: createAudioPath("نارنجی-تیره") },
    { name: "نقره ای", hex: "#C0C0C0", rgb: [192, 192, 192], audio: createAudioPath("نقره-ای") }
  ];

  // تابع بررسی وجود فایل صوتی
  async function checkAudioExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      return response.ok;
    } catch (e) {
      console.error('خطا در بررسی فایل صوتی:', url, e);
      return false;
    }
  }

  // تابع پخش صوت رنگ
  async function playColorAudio(audioUrl, colorName) {
    if (!audioUrl || colorName === 'در انتظار...' || colorName === 'رنگ ناشناخته') {
      console.warn('صوت یا نام رنگ معتبر نیست');
      showMessage('لطفاً ابتدا یک رنگ معتبر تشخیص دهید.');
      return;
    }
    const audioExists = await checkAudioExists(audioUrl);
    if (!audioExists) {
      console.warn('فایل صوتی یافت نشد:', audioUrl);
      showMessage(`فایل صوتی برای رنگ "${colorName}" یافت نشد.`);
      return;
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(audioUrl);
    currentAudio.play().catch(e => {
      console.error('خطا در پخش صوت:', e, 'URL:', audioUrl);
      showMessage(`خطا در پخش صدا برای "${colorName}": ${e.message}`);
    });
    currentAudio.onended = () => console.log('صوت تمام شد:', colorName);
  }

  // تابع دسترسی به دوربین
  async function getCameraStream() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }
    try {
      const constraints = {
        video: {
          facingMode: useFrontCamera ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      console.log('درخواست دوربین با تنظیمات:', constraints);
      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = currentStream;
      video.onloadedmetadata = () => {
        console.log('متادیتای ویدیو لود شد:', video.videoWidth, video.videoHeight);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const aspectRatio = video.videoHeight / video.videoWidth;
        videoContainer.style.paddingTop = `${aspectRatio * 100}%`;
        video.style.filter = `brightness(${brightnessSlider.value}) contrast(1)`;
        console.log('روشنایی اولیه تنظیم شد:', brightnessSlider.value);
        requestAnimationFrame(draw);
      };
      video.onerror = (err) => {
        console.error('خطای المنت ویدیویی:', err);
        showMessage('خطا در بارگذاری ویدیو: ' + err.message);
      };
    } catch (err) {
      console.error('خطای دسترسی به دوربین:', err);
      let errorMessage = 'دسترسی به دوربین رد شد یا در دسترس نیست.';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'لطفاً اجازه دسترسی به دوربین را بدهید.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'دوربین در دسترس نیست. لطفاً بررسی کنید که دوربین متصل است.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'دوربین در حال استفاده توسط برنامه دیگری است.';
      }
      showMessage(errorMessage);
      if (!useFrontCamera) {
        console.log('فال‌بک به دوربین جلو');
        useFrontCamera = true;
        getCameraStream();
      }
    }
  }

  // تابع تبدیل RGB به LAB
  function rgbToLab(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);
    const l = (116 * y) - 16;
    const a = 500 * (x - y);
    const bb = 200 * (y - z);
    return [l, a, bb];
  }

  // تابع محاسبه فاصله رنگی
  function getColorDistance(lab1, lab2) {
    return Math.sqrt(
      Math.pow(lab1[0] - lab2[0], 2) +
      Math.pow(lab1[1] - lab2[1], 2) +
      Math.pow(lab1[2] - lab2[2], 2)
    );
  }

  // محاسبه مقادیر LAB برای رنگ‌ها
  colors.forEach(color => {
    color.lab = rgbToLab(color.rgb[0], color.rgb[1], color.rgb[2]);
  });

  // تابع پیدا کردن نزدیک‌ترین رنگ
  function findClosestColor(r, g, b) {
    const inputLab = rgbToLab(r, g, b);
    let minDistance = Infinity;
    let closestColor = null;
    for (const color of colors) {
      const distance = getColorDistance(inputLab, color.lab);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
    if (minDistance > COLOR_DISTANCE_THRESHOLD) {
      return { name: "رنگ ناشناخته", hex: "#000000", rgb: [0, 0, 0], audio: null };
    }
    return closestColor;
  }

  // تابع اعمال روشنایی به داده‌های تصویر
  function applyBrightnessToImageData(imageData, brightness) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * brightness); // R
      data[i + 1] = Math.min(255, data[i + 1] * brightness); // G
      data[i + 2] = Math.min(255, data[i + 2] * brightness); // B
      // Alpha بدون تغییر
    }
    return imageData;
  }

  // تابع رندر فریم‌ها
  function draw() {
  if (!isPaused && video.readyState === video.HAVE_ENOUGH_DATA) {
    // کشیدن تصویر روی canvas اصلی
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);

    // 👇 موقعیت واقعی ویدیو روی صفحه
    const videoRect = video.getBoundingClientRect();
    const centerScreenX = videoRect.left + videoRect.width / 2;
    const centerScreenY = videoRect.top + videoRect.height / 2;

    // 👇 قرار دادن ذره‌بین دقیقا وسط تصویر ویدیو
    magnifierCanvas.style.position = "fixed";
    magnifierCanvas.style.top = `${centerScreenY}px`;
    magnifierCanvas.style.left = `${centerScreenX}px`;
    magnifierCanvas.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;

    // محاسبه اندازه ناحیه ذره‌بین
    const magnifierZoom = BASE_MAGNIFIER_ZOOM * zoomLevel;
    const magnifierSize = MAGNIFIER_SIZE / magnifierZoom;

    // ایجاد canvas موقت برای اعمال روشنایی
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = magnifierSize;
    tempCanvas.height = magnifierSize;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(
      video,
      centerX - magnifierSize / 2,
      centerY - magnifierSize / 2,
      magnifierSize,
      magnifierSize,
      0,
      0,
      magnifierSize,
      magnifierSize
    );

    // اعمال روشنایی روی ناحیه ذره‌بین
    const brightnessValue = parseFloat(brightnessSlider.value);
    const magnifierImageData = tempCtx.getImageData(0, 0, magnifierSize, magnifierSize);
    const adjustedImageData = applyBrightnessToImageData(magnifierImageData, brightnessValue);
    tempCtx.putImageData(adjustedImageData, 0, 0);

    // کشیدن تصویر زوم‌شده روی magnifierCanvas
    magnifierCtx.clearRect(0, 0, MAGNIFIER_SIZE, MAGNIFIER_SIZE);
    magnifierCtx.drawImage(
      tempCanvas,
      0,
      0,
      magnifierSize,
      magnifierSize,
      0,
      0,
      MAGNIFIER_SIZE,
      MAGNIFIER_SIZE
    );

    // اضافه کردن crosshair روی ذره‌بین
    magnifierCtx.beginPath();
    magnifierCtx.arc(MAGNIFIER_SIZE / 2, MAGNIFIER_SIZE / 2, 5, 0, 2 * Math.PI);
    magnifierCtx.strokeStyle = 'white';
    magnifierCtx.lineWidth = 2;
    magnifierCtx.stroke();

    // برداشت رنگ با روشنایی اعمال‌شده
    const colorTempCanvas = document.createElement('canvas');
    colorTempCanvas.width = canvas.width;
    colorTempCanvas.height = canvas.height;
    const colorTempCtx = colorTempCanvas.getContext('2d');
    colorTempCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const colorImageData = colorTempCtx.getImageData(0, 0, canvas.width, canvas.height);
    const adjustedColorImageData = applyBrightnessToImageData(colorImageData, brightnessValue);
    colorTempCtx.putImageData(adjustedColorImageData, 0, 0);
    const pixel = colorTempCtx.getImageData(centerX, centerY, 1, 1).data;
    const [r, g, b] = pixel;

    const closestColor = findClosestColor(r, g, b);
    colorNameEl.textContent = closestColor.name;
    hexCodeEl.textContent = closestColor.hex;
    rgbCodeEl.textContent = `RGB(${closestColor.rgb[0]}, ${closestColor.rgb[1]}, ${closestColor.rgb[2]})`;
    colorBoxEl.style.backgroundColor = closestColor.hex;

    console.log('رنگ تشخیص داده شد:', closestColor.name, 'RGB:', r, g, b);
  }

  requestAnimationFrame(draw);
}

  // Event Listenerها
  switchCameraBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    console.log('تعویض دوربین, useFrontCamera:', useFrontCamera);
    getCameraStream();
  });

  pauseResumeBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
      pauseResumeIcon.classList.remove('fa-pause');
      pauseResumeIcon.classList.add('fa-play');
      video.pause();
    } else {
      pauseResumeIcon.classList.remove('fa-play');
      pauseResumeIcon.classList.add('fa-pause');
      video.play().catch(err => {
        console.error('خطا در پخش ویدیو:', err);
        showMessage('خطا در پخش ویدیو: ' + err.message);
      });
    }
  });

  playColorBtn.addEventListener('click', () => {
    const currentColorName = colorNameEl.textContent;
    const color = colors.find(c => c.name === currentColorName);
    if (color && currentColorName !== 'در انتظار...' && currentColorName !== 'رنگ ناشناخته') {
      playColorAudio(color.audio, currentColorName);
    } else {
      showMessage('لطفاً ابتدا یک رنگ معتبر تشخیص دهید تا نام آن پخش شود.');
    }
  });

  zoomInBtn.addEventListener('click', () => {
    if (zoomLevel < MAX_ZOOM) {
      zoomLevel += ZOOM_STEP;
      magnifierCanvas.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;
      console.log('بزرگ‌نمایی:', zoomLevel);
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (zoomLevel > MIN_ZOOM) {
      zoomLevel -= ZOOM_STEP;
      magnifierCanvas.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;
      console.log('کوچک‌نمایی:', zoomLevel);
    }
  });

  brightnessSlider.addEventListener('input', () => {
    const brightnessValue = brightnessSlider.value;
    video.style.filter = `brightness(${brightnessValue}) contrast(1)`;
    console.log('روشنایی تنظیم شد:', brightnessValue);
  });

  closeModalBtn.addEventListener('click', () => {
    messageModal.classList.add('hidden');
    console.log('مودال بسته شد');
  });

  // بررسی پشتیبانی از getUserMedia
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showMessage('مرورگر شما از دسترسی به دوربین پشتیبانی نمی‌کند.');
    console.error('getUserMedia پشتیبانی نمی‌شود');
    return;
  }

  // شروع جریان دوربین
  getCameraStream();
}

// اجرای تابع هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tool-color-picker')) {
    initColorPicker();
  }
});







