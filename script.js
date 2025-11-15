// Select elements
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');

let tasks = [];

// Utility: save / load from localStorage
const STORAGE_KEY = 'todo_tasks_v1';
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  tasks = raw ? JSON.parse(raw) : [];
}

// Render tasks to DOM
function render() {
  list.innerHTML = '';
  if (tasks.length === 0) {
    counter.textContent = '0 tasks';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' completed' : '');
    li.dataset.id = task.id;

    // custom checkbox
    const checkbox = document.createElement('button');
    checkbox.className = 'checkbox' + (task.done ? ' checked' : '');
    checkbox.setAttribute('aria-label', task.done ? 'Mark as not complete' : 'Mark as complete');
    checkbox.innerHTML = task.done ? '✓' : '';

    const span = document.createElement('div');
    span.className = 'text';
    span.textContent = task.text;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.setAttribute('aria-label', 'Remove task');
    removeBtn.innerHTML = '🗑';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });

  counter.textContent = `${tasks.length} task${tasks.length > 1 ? 's' : ''}`;
}

// Create task
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const task = {
    id: Date.now().toString(),
    text: trimmed,
    done: false
  };
  tasks.unshift(task); // newest first
  saveTasks();
  render();
}

// Toggle or remove using event delegation
list.addEventListener('click', (e) => {
  const li = e.target.closest('li.task');
  if (!li) return;
  const id = li.dataset.id;

  // Checkbox clicked
  if (e.target.classList.contains('checkbox')) {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    saveTasks();
    render();
    return;
  }

  // Remove clicked
  if (e.target.classList.contains('remove-btn')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
    return;
  }

  // Clicking text toggles completion
  if (e.target.classList.contains('text')) {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    saveTasks();
    render();
  }
});

// Form submit -> add
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

// Clear completed
clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
});

// Clear all
clearAllBtn.addEventListener('click', () => {
  if (!confirm('Clear all tasks?')) return;
  tasks = [];
  saveTasks();
  render();
});

// Initialize
loadTasks();
render();
