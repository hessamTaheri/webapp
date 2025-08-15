function initCameraSimulator() {
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
  let currentStream, currentStreamReal;
  let useFrontCamera = false;
  let isCameraStarted = false;
  async function getCameraStream() {
    if (currentStream) currentStream.getTracks().forEach(track => track.stop());
    try {
      const constraints = {
        video: { facingMode: useFrontCamera ? 'user' : 'environment' }
      };
      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = currentStream;
    } catch (err) {
      alert("دسترسی به دوربین رد شد یا در دسترس نیست.");
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
    } catch (err) {
      console.log("دسترسی به دوربین واقعی رد شد.");
    }
  }
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
  function updateCameras() {
    if (window.matchMedia("(orientation: landscape)").matches) {
      getCameraStreamReal();
      getCameraStream();
      canvasReal.style.display = 'block';
    } else {
      if (currentStreamReal) currentStreamReal.getTracks().forEach(track => track.stop());
      getCameraStream();
      canvasReal.style.display = 'none';
    }
  }
  switchBtn.addEventListener('click', () => {
    if (!isCameraStarted) return;
    useFrontCamera = !useFrontCamera;
    updateCameras();
  });
  startBtn.addEventListener('click', () => {
    if (!isCameraStarted) {
      isCameraStarted = true;
      updateCameras().then(() => requestAnimationFrame(draw));
    }
  });
  modeRadios.forEach(radio => radio.addEventListener('change', draw));
  intensitySlider.addEventListener('input', draw);
  window.addEventListener('orientationchange', updateCameras);
  updateCameras();
}