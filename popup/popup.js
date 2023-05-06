let tasks = [];

const addTaskBtn = document.getElementById('add-task-btn');
const startTimerBtn = document.getElementById('start-timer-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');
const time = document.getElementById('time');

if (addTaskBtn) {
  addTaskBtn.addEventListener('click', () => addTask());
}

if (startTimerBtn) {
  startTimerBtn.addEventListener('click', () => {
    chrome.storage.local.get(['isRunning'], (res) => {
      chrome.storage.local.set({ isRunning: !res.isRunning }, () => {
        startTimerBtn.textContent = !res.isRunning ? 'Pause Timer' : 'Start Timer';
      });
    });
  });
}

if (resetTimerBtn) {
  resetTimerBtn.addEventListener('click', () => {
    chrome.storage.local.set({ timer: 0, isRunning: false }, () => {
      startTimerBtn.textContent = 'Start Timer';
    });
  });
}

chrome.storage.sync.get(['tasks'], (res) => {
  tasks = res.tasks || [];
  renderTasks();
});

function updateTime() {
  chrome.storage.local.get(['timer', 'timeOption'], (res) => {
    const time = document.getElementById('time');
    const minute = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, '0');
    let seconds = '00';
    if (res.timer % 60 != 0) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, '0');
    }
    time.textContent = `${minute}:${seconds}`;
  });
}
updateTime();
setInterval(updateTime, 1000);

function renderTask(taskNo) {
  const taskRow = document.createElement('div');
  const text = document.createElement('input');
  text.type = 'text';
  text.placeholder = 'Enter a task';
  text.className = 'task-input';
  text.value = tasks[taskNo];

  text.addEventListener('change', () => {
    tasks[taskNo] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement('input');
  deleteBtn.type = 'button';
  deleteBtn.value = 'x';
  deleteBtn.className = 'task-delete';

  deleteBtn.addEventListener('click', () => {
    deleteTask(taskNo);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById('task-container');
  taskContainer.appendChild(taskRow);
}

function addTask() {
  const taskNo = tasks.length;
  tasks.push('');

  renderTask(taskNo);
  saveTasks();
}

function deleteTask(taskNo) {
  tasks.splice(taskNo, 1);
  renderTasks();
  saveTasks();
}

function renderTasks() {
  const taskContainer = document.getElementById('task-container');
  taskContainer.textContent = '';

  tasks.forEach((taskText, taskNo) => {
    renderTask(taskNo);
  });
}

function saveTasks() {
  chrome.storage.sync.set({ tasks: tasks });
}
