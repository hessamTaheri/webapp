function initPictureSimulator() {
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
  const colorTransformMatrices = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0, 1]
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0, 1]
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525]
    ]
  };
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
  function loadImage(src) {
    loading.style.display = 'block';
    img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      mainCanvas.width = img.width;
      mainCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImageData = ctx.getImageData(0, 0, img.width, img.height);
      applySimulation();
      loading.style.display = 'none';
    };
    img.onerror = function () {
      alert('خطا در بارگذاری تصویر. لطفاً تصویر دیگری انتخاب کنید.');
      loading.style.display = 'none';
    };
    img.src = src;
  }
  imageLoader.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file && file.size > 20 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۲۰ مگابایت باشد.');
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
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('active');
  });
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
  });
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
  });
  dropArea.addEventListener('click', () => imageLoader.click());
  const savedMode = localStorage.getItem('colorblindMode-picture') || 'normal';
  document.querySelector(`input[value="${savedMode}"]`).checked = true;
  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      localStorage.setItem('colorblindMode-picture', radio.value);
      applySimulation();
    });
  });
  sampleImages.forEach(imgElement => {
    imgElement.addEventListener('click', () => {
      const src = imgElement.getAttribute('data-src');
      document.querySelector('input[value="normal"]').checked = true;
      localStorage.setItem('colorblindMode-picture', 'normal');
      loadImage(src);
    });
    imgElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const src = imgElement.getAttribute('data-src');
        document.querySelector('input[value="normal"]').checked = true;
        localStorage.setItem('colorblindMode-picture', 'normal');
        loadImage(src);
      }
    });
  });
  intensitySlider.addEventListener('input', () => {
    intensityValue.textContent = `${Math.round(intensitySlider.value * 100)}%`;
    applySimulation();
  });
  mainCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); showOriginal(); });
  mainCanvas.addEventListener('touchend', (e) => { e.preventDefault(); applySimulation(); });
  mainCanvas.addEventListener('mousedown', (e) => { e.preventDefault(); showOriginal(); });
  mainCanvas.addEventListener('mouseup', (e) => { e.preventDefault(); applySimulation(); });
  mainCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
  downloadBtn.addEventListener('click', () => {
    if (!img.src) {
      alert('هیچ تصویری بارگذاری نشده است.');
      return;
    }
    const MAX_WIDTH = 2560;
    const MAX_HEIGHT = 1440;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    let newWidth = mainCanvas.width;
    let newHeight = mainCanvas.height;
    if (newWidth > MAX_WIDTH) {
      newHeight = (MAX_WIDTH / newWidth) * newHeight;
      newWidth = MAX_WIDTH;
    }
    if (newHeight > MAX_HEIGHT) {
      newWidth = (MAX_HEIGHT / newHeight) * newWidth;
      newHeight = MAX_HEIGHT;
    }
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    tempCtx.drawImage(mainCanvas, 0, 0, newWidth, newHeight);
    const text = 'koorrangi.ir';
    const fontSize = Math.floor(tempCanvas.width / 20);
    tempCtx.font = `${fontSize}px Vazir`;
    tempCtx.textAlign = 'right';
    tempCtx.textBaseline = 'bottom';
    const metrics = tempCtx.measureText(text);
    const padding = 10;
    const textWidth = metrics.width;
    const textHeight = fontSize;
    const rectX = tempCanvas.width - textWidth - padding * 2;
    const rectY = tempCanvas.height - textHeight - padding * 2;
    tempCtx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    tempCtx.fillRect(rectX, rectY, textWidth + padding * 2, textHeight + padding);
    tempCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    tempCtx.fillText(text, tempCanvas.width - 10, tempCanvas.height - 10);
    const tryQuality = (quality, callback) => {
      tempCanvas.toBlob((blob) => {
        const sizeMB = blob.size / (1024 * 1024);
        if (sizeMB >= 1 && sizeMB <= 1.5 || quality <= 0.9) {
          callback(blob);
        } else {
          tryQuality(quality - 0.05, callback);
        }
      }, 'image/jpeg', quality);
    };
    try {
      tryQuality(0.95, (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'simulated_image.jpg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        tempCanvas.remove();
      });
    } catch (error) {
      alert('خطا در دانلود تصویر. لطفاً تصویر کوچک‌تری انتخاب کنید.');
    }
  });
  function showOriginal() {
    if (!originalImageData) return;
    ctx.putImageData(originalImageData, 0, 0);
  }
  function applySimulation() {
    if (!originalImageData) return;
    const selectedMode = document.querySelector('input[name="mode-picture"]:checked').value;
    const intensity = parseFloat(intensitySlider.value);
    if (selectedMode === "normal") {
      showOriginal();
      return;
    }
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
  }
  loadImage("https://www.koorrangi.ir/wp-content/uploads/2025/07/001191fc-4fdb-4f0e-8bb8-4a079a7e8f6a.jpg");
}