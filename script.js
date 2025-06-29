// Get DOM Elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const durationInput = document.getElementById("duration-input");
const taskList = document.getElementById("task-list");
const activeTaskEl = document.getElementById("active-task");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

// Data
let tasks = [];
let selectedTask = null;
let timer = null;
let timeLeft = 0;

const priorityOrder = { high: 1, medium: 2, low: 3 };

// Handle form submit
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  const duration = parseInt(durationInput.value); // in minutes

  if (!taskText || !duration || duration < 1) return;

  tasks.push({
    text: taskText,
    priority,
    duration,
  });

  taskInput.value = "";
  durationInput.value = "";

  renderTasks();
});

// Render tasks
function renderTasks() {
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Content div for flex layout
    const contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    const span = document.createElement("span");
    span.textContent = `${task.text} (${task.duration} min)`;

    const badge = document.createElement("span");
    badge.className = `badge ${task.priority}`;
    badge.textContent = task.priority;

    contentDiv.appendChild(span);
    contentDiv.appendChild(badge);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent triggering task selection
      tasks.splice(index, 1);

      if (selectedTask && selectedTask.text === task.text) {
        selectedTask = null;
        activeTaskEl.textContent = "None";
        resetPomodoro();
      }

      renderTasks();
    });

    // Set task on click
    li.addEventListener("click", () => {
      selectedTask = task;
      activeTaskEl.textContent = task.text;
      timeLeft = task.duration * 60;
      resetPomodoro();
    });

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Timer functions
function startPomodoro() {
  if (!selectedTask) {
    alert("Select a task to start the timer.");
    return;
  }

  if (timer) return;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      timer = null;
      alert(`⏰ Time's up for: ${selectedTask.text}`);
    }
  }, 1000);
}

function resetPomodoro() {
  clearInterval(timer);
  timer = null;

  if (selectedTask) {
    timeLeft = selectedTask.duration * 60;
    updateTimerDisplay();
  } else {
    timeLeft = 0;
    timerEl.textContent = "00:00";
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Button bindings
startBtn.addEventListener("click", startPomodoro);
resetBtn.addEventListener("click", resetPomodoro);
