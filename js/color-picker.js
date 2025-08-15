function initColorPicker() {
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
  const colorNameEl = document.getElementById('colorName-color');
  const hexCodeEl = document.getElementById('hexCode-color');
  const rgbCodeEl = document.getElementById('rgbCode-color');
  const colorBoxEl = document.getElementById('colorBox-color');
  const messageModal = document.getElementById('messageModal-color');
  const modalMessage = document.getElementById('modalMessage-color');
  const closeModalBtn = document.getElementById('closeModalBtn-color');
  let currentStream;
  let useFrontCamera = false;
  let isPaused = false;
  let currentAudio = null;
  let zoomLevel = 1.0;
  const MAX_ZOOM = 3.0;
  const MIN_ZOOM = 1.0;
  const ZOOM_STEP = 0.2;
  const MAGNIFIER_SIZE = 100;
  const MAGNIFIER_ZOOM = 3;
  magnifierCanvas.width = MAGNIFIER_SIZE;
  magnifierCanvas.height = MAGNIFIER_SIZE;
  const AUDIO_BASE_URL = 'https://www.koorrangi.ir/wp-content/uploads/2025/08/';
  const colors = [
    { name: "قرمز", hex: "#FF0000", rgb: [255, 0, 0], audio: createAudioPath("قرمز") },
    { name: "سبز", hex: "#00FF00", rgb: [0, 255, 0], audio: createAudioPath("سبز") },
    { name: "آبی", hex: "#0000FF", rgb: [0, 0, 255], audio: createAudioPath("آبی") },
    { name: "زرد", hex: "#FFFF00", rgb: [255, 255, 0], audio: createAudioPath("زرد") },
    { name: "مشکی", hex: "#000000", rgb: [0, 0, 0], audio: createAudioPath("مشکی") },
    { name: "سفید", hex: "#FFFFFF", rgb: [255, 255, 255], audio: createAudioPath("سفید") },
    { name: "نارنجی", hex: "#FFA500", rgb: [255, 165, 0], audio: createAudioPath("نارنجی") },
    { name: "بنفش", hex: "#800080", rgb: [128, 0, 128], audio: createAudioPath("بنفش") },
    { name: "قهوه‌ای", hex: "#A52A2A", rgb: [165, 42, 42], audio: createAudioPath("قهوه‌ای") },
    { name: "خاکستری", hex: "#808080", rgb: [128, 128, 128], audio: createAudioPath("خاکستری") }
  ];
  function showMessage(message) {
    modalMessage.textContent = message;
    messageModal.classList.remove('hidden');
  }
  const createAudioPath = (persianName) => {
    const sanitizedName = persianName.replace(/ /g, '-');
    return `${AUDIO_BASE_URL}${sanitizedName}.mp3`;
  };
  async function checkAudioExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      return response.ok;
    } catch (e) {
      return false;
    }
  }
  async function playColorAudio(audioUrl, colorName) {
    if (!audioUrl || colorName === 'در انتظار...') return;
    const audioExists = await checkAudioExists(audioUrl);
    if (!audioExists) {
      showMessage(`فایل صوتی برای رنگ "${colorName}" یافت نشد.`);
      return;
    }
    if (currentAudio) currentAudio.pause();
    currentAudio = new Audio(audioUrl);
    currentAudio.play().catch(e => showMessage(`خطا در پخش صدا: ${e.message}`));
  }
  async function getCameraStream() {
    if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    try {
      const constraints = {
        video: {
          facingMode: useFrontCamera ? 'user' : 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };
      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = currentStream;
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const aspectRatio = video.videoHeight / video.videoWidth;
        videoContainer.style.paddingTop = `${aspectRatio * 100}%`;
      };
    } catch (err) {
      showMessage('دسترسی به دوربین رد شد یا در دسترس نیست.');
    }
  }
  function getColorDistance(rgb1, rgb2) {
    return Math.sqrt(
      (rgb1[0] - rgb2[0]) ** 2 +
      (rgb1[1] - rgb2[1]) ** 2 +
      (rgb1[2] - rgb2[2]) ** 2
    );
  }
  function findClosestColor(r, g, b) {
    let minDistance = Infinity;
    let closestColor = colors[0];
    for (const color of colors) {
      const distance = getColorDistance([r, g, b], color.rgb);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
    return closestColor;
  }
  function draw() {
    if (!isPaused && video.readyState === video.HAVE_ENOUGH_DATA) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.classList.remove('fixed');
    }
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
    const [r, g, b] = pixel;
    const magnifierSize = MAGNIFIER_SIZE / MAGNIFIER_ZOOM;
    magnifierCtx.drawImage(
      canvas,
      centerX - magnifierSize / 2,
      centerY - magnifierSize / 2,
      magnifierSize,
      magnifierSize,
      0,
      0,
      MAGNIFIER_SIZE,
      MAGNIFIER_SIZE
    );
    const closestColor = findClosestColor(r, g, b);
    colorNameEl.textContent = closestColor.name;
    hexCodeEl.textContent = closestColor.hex;
    rgbCodeEl.textContent = `RGB(${r}, ${g}, ${b})`;
    colorBoxEl.style.backgroundColor = closestColor.hex;
    requestAnimationFrame(draw);
  }
  switchCameraBtn.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    getCameraStream();
  });
  pauseResumeBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
      pauseResumeIcon.classList.remove('fa-pause');
      pauseResumeIcon.classList.add('fa-play');
      video.pause();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.classList.add('fixed');
    } else {
      pauseResumeIcon.classList.remove('fa-play');
      pauseResumeIcon.classList.add('fa-pause');
      video.play();
      canvas.classList.remove('fixed');
    }
  });
  playColorBtn.addEventListener('click', () => {
    const currentColorName = colorNameEl.textContent;
    const color = colors.find(c => c.name === currentColorName);
    if (color && currentColorName !== 'در انتظار...') {
      playColorAudio(color.audio, currentColorName);
    } else {
      showMessage('لطفاً ابتدا یک رنگ را تشخیص دهید تا نام آن پخش شود.');
    }
  });
  zoomInBtn.addEventListener('click', () => {
    if (zoomLevel < MAX_ZOOM) {
      zoomLevel += ZOOM_STEP;
      video.style.transform = `scale(${zoomLevel})`;
    }
  });
  zoomOutBtn.addEventListener('click', () => {
    if (zoomLevel > MIN_ZOOM) {
      zoomLevel -= ZOOM_STEP;
      video.style.transform = `scale(${zoomLevel})`;
    }
  });
  closeModalBtn.addEventListener('click', () => {
    messageModal.classList.add('hidden');
  });
  getCameraStream().then(() => {
    requestAnimationFrame(draw);
  });
}