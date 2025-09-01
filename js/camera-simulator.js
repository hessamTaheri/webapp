function initCameraSimulator() {
  // المنت‌های موردنیاز
  const video = document.getElementById('video-camera');
  const canvas = document.getElementById('canvas-camera');
  const ctx = canvas.getContext('2d');
  const videoReal = document.getElementById('video-camera-real');
  const canvasReal = document.getElementById('canvas-camera-real');
  const ctxReal = canvasReal.getContext('2d');
  const modeRadios = document.querySelectorAll('input[name="mode-camera"]');
  const intensitySlider = document.getElementById('intensity-camera');
  const switchBtn = document.getElementById('switchCamera-camera');
  const startBtn = document.getElementById('startCamera-camera');
  const permissionModal = document.getElementById('cameraPermissionModal-camera');
  const allowCameraBtn = document.getElementById('allowCameraBtn-camera');
  const cameraHint = document.getElementById('camera-hint');
  let currentStream, currentStreamReal;
  let useFrontCamera = false;
  let isCameraStarted = false;

  // بررسی وجود المنت‌ها
  if (!video || !canvas || !videoReal || !canvasReal || !modeRadios.length || !intensitySlider || !switchBtn || !startBtn || !permissionModal || !allowCameraBtn || !cameraHint) {
    console.error('یکی از المنت‌های موردنیاز برای شبیه‌ساز دوربین یافت نشد:', {
      video: !!video,
      canvas: !!canvas,
      videoReal: !!videoReal,
      canvasReal: !!canvasReal,
      modeRadios: modeRadios.length,
      intensitySlider: !!intensitySlider,
      switchBtn: !!switchBtn,
      startBtn: !!startBtn,
      permissionModal: !!permissionModal,
      allowCameraBtn: !!allowCameraBtn,
      cameraHint: !!cameraHint
    });
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = 'خطا: نمی‌توان شبیه‌ساز دوربین را بارگذاری کرد. لطفاً مطمئن شوید که ساختار HTML درست تنظیم شده است.';
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 10000);
    return;
  }

  // غیرفعال کردن کنترل‌ها تا فعال شدن دوربین
  function toggleControls(enabled) {
    modeRadios.forEach(radio => (radio.disabled = !enabled));
    intensitySlider.disabled = !enabled;
    switchBtn.disabled = !enabled;
    cameraHint.style.display = enabled ? 'none' : 'block';
  }

  // درخواست دسترسی به دوربین
  async function getCameraStream() {
    if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    try {
      const constraints = {
        video: { facingMode: useFrontCamera ? 'user' : 'environment' }
      };
      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = currentStream;
      return true;
    } catch (err) {
      console.error('خطای دسترسی به دوربین:', err);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = 'دسترسی به دوربین رد شد یا در دسترس نیست. لطفاً اجازه دسترسی را فعال کنید.';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 8000);
      return false;
    }
  }

  async function getCameraStreamReal() {
    if (currentStreamReal) currentStreamReal.getTracks().forEach(track => track.stop());
    try {
      const constraints = {
        video: { facingMode: useFrontCamera ? 'user' : 'environment' }
      };
      currentStreamReal = await navigator.mediaDevices.getUserMedia(constraints);
      videoReal.srcObject = currentStreamReal;
      return true;
    } catch (err) {
      console.error('خطای دسترسی به دوربین واقعی:', err);
      return false;
    }
  }

  // اعمال فیلتر کوررنگی
  function applyColorFilter(imageData, type, intensity) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] / 255;
      let g = data[i + 1] / 255;
      let b = data[i + 2] / 255;
      let newR = r, newG = g, newB = b;
      if (type === 'protan') {
        newR = (0.567 * r + 0.433 * g) * intensity + r * (1 - intensity);
        newG = (0.558 * r + 0.442 * g) * intensity + g * (1 - intensity);
        newB = b;
      } else if (type === 'deutan') {
        newR = (0.625 * r + 0.375 * g) * intensity + r * (1 - intensity);
        newG = (0.7 * r + 0.3 * g) * intensity + g * (1 - intensity);
        newB = b;
      } else if (type === 'tritan') {
        newR = (0.95 * r + 0.05 * g) * intensity + r * (1 - intensity);
        newG = (0.433 * g + 0.567 * b) * intensity + g * (1 - intensity);
        newB = (0.475 * g + 0.525 * b) * intensity + b * (1 - intensity);
      } else if (type === 'achroma') {
        const avg = (0.299 * r + 0.587 * g + 0.114 * b) * intensity;
        newR = avg + r * (1 - intensity);
        newG = avg + g * (1 - intensity);
        newB = avg + b * (1 - intensity);
      }
      data[i] = newR * 255;
      data[i + 1] = newG * 255;
      data[i + 2] = newB * 255;
    }
    return imageData;
  }

  // رندر فریم‌ها
  function draw() {
    if (!isCameraStarted) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const type = document.querySelector('input[name="mode-camera"]:checked').value;
      const intensity = parseFloat(intensitySlider.value);
      if (type !== 'none') {
        frame = applyColorFilter(frame, type, intensity);
        ctx.putImageData(frame, 0, 0);
      }
    }
    if (window.matchMedia("(orientation: landscape)").matches && videoReal.readyState === videoReal.HAVE_ENOUGH_DATA) {
      canvasReal.width = videoReal.videoWidth;
      canvasReal.height = videoReal.videoHeight;
      ctxReal.drawImage(videoReal, 0, 0, canvasReal.width, canvasReal.height);
      videoReal.style.display = 'none';
      canvasReal.style.display = 'block';
    } else {
      videoReal.style.display = 'none';
      canvasReal.style.display = 'none';
    }
    requestAnimationFrame(draw);
  }

  // به‌روزرسانی جریان دوربین
  async function updateCameras() {
    if (!isCameraStarted) return;
    const success = await getCameraStream();
    if (!success) {
      isCameraStarted = false;
      toggleControls(false);
      permissionModal.style.display = 'flex';
      return;
    }
    if (window.matchMedia("(orientation: landscape)").matches) {
      await getCameraStreamReal();
      canvasReal.style.display = 'block';
    } else {
      if (currentStreamReal) currentStreamReal.getTracks().forEach(track => track.stop());
      canvasReal.style.display = 'none';
    }
  }

  // مدیریت کلیک دکمه اجازه دسترسی
  allowCameraBtn.addEventListener('click', async () => {
    permissionModal.style.display = 'none';
    isCameraStarted = true;
    toggleControls(true);
    await updateCameras();
    requestAnimationFrame(draw);
  });

  // مدیریت دکمه شروع دوربین
  startBtn.addEventListener('click', async () => {
    if (!isCameraStarted) {
      permissionModal.style.display = 'flex';
    }
  });

  // مدیریت تعویض دوربین
  switchBtn.addEventListener('click', async () => {
    if (!isCameraStarted) return;
    useFrontCamera = !useFrontCamera;
    await updateCameras();
  });

  // رویدادهای تغییر حالت و شدت
  modeRadios.forEach(radio => radio.addEventListener('change', draw));
  intensitySlider.addEventListener('input', draw);

  // رویداد تغییر جهت صفحه
  window.addEventListener('orientationchange', updateCameras);

  // نمایش مودال هنگام ورود به ابزار
  function initialize() {
    toggleControls(false);
    permissionModal.style.display = 'flex';
  }

  // اجرای اولیه
  initialize();
}

// اجرای تابع با تأخیر برای سازگاری با وردپرس/المنتور
function runCameraSimulator() {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initCameraSimulator();
  } else {
    document.addEventListener('DOMContentLoaded', initCameraSimulator);
    setTimeout(() => {
      if (!document.getElementById('video-camera')) {
        console.warn('تلاش مجدد برای اجرای شبیه‌ساز دوربین...');
        initCameraSimulator();
      }
    }, 1000);
  }
}

runCameraSimulator();