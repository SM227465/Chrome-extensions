const timeOption = document.getElementById('time-option');
const saveBtn = document.getElementById('save-btn');

if (timeOption) {
  timeOption.addEventListener('change', (event) => {
    const value = event.target.value;

    if (value < 1 || value > 60) {
      timeOption.value = 25;
    }
  });
}

if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    chrome.storage.local.set({ timeOption: timeOption.value, timer: 0, isRunning: false });
  });
}

chrome.storage.local.get(['timeOption'], (res) => {
  timeOption.value = res.timeOption || 25;
});
