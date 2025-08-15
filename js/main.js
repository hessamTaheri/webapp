// مدیریت Add to Home Screen
let deferredPrompt;
const addToHomeBtn = document.getElementById('add-to-home');
const installInstructions = document.getElementById('install-instructions');
const dismissA2hsBtn = document.getElementById('dismiss-a2hs');
function showA2hsPrompt() {
  if (!localStorage.getItem('a2hsPromptDismissed')) {
    addToHomeBtn.style.display = 'block';
    installInstructions.style.display = 'block';
  }
}
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showA2hsPrompt();
});
addToHomeBtn.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('a2hsPromptDismissed', 'true');
      }
      deferredPrompt = null;
      addToHomeBtn.style.display = 'none';
      installInstructions.style.display = 'none';
    });
  }
});
dismissA2hsBtn.addEventListener('click', () => {
  localStorage.setItem('a2hsPromptDismissed', 'true');
  addToHomeBtn.style.display = 'none';
  installInstructions.style.display = 'none';
});

// ناوبری بین صفحات
function openTool(toolId) {
  document.getElementById('app-home').style.display = 'none';
  document.getElementById('tool-' + toolId).classList.add('active');
  if (toolId === 'camera-simulator') initCameraSimulator();
  if (toolId === 'picture-simulator') initPictureSimulator();
  if (toolId === 'website-simulator') initWebsiteSimulator();
  if (toolId === 'color-picker') initColorPicker();
  if (toolId === 'ishihara-test') initIshiharaTest();
  if (toolId === 'hrr-test') initHrrTest();
}
function closeTool() {
  document.querySelectorAll('.tool-page').forEach(el => el.classList.remove('active'));
  document.getElementById('app-home').style.display = 'grid';
}

// PWA سرویس ورکر
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => console.log('Service Worker Registered'));
}