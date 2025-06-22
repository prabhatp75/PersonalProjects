// Daily Planner App JS
// Features: hourly schedule, add/edit/delete tasks, color coding, completion, notes, localStorage, navigation, reminders, search/filter, print/export, theme switcher, progress bar, quick add, drag-and-drop

const HOURS = Array.from({length: 17}, (_, i) => i + 6); // 6am to 10pm
const HOUR_LABELS = HOURS.map(h => {
    const ampm = h < 12 ? 'AM' : 'PM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:00 ${ampm}`;
});

let currentDate = new Date();
currentDate.setHours(0,0,0,0);

function formatDateKey(date) {
    return date.toISOString().slice(0,10);
}

function getPlannerData(date) {
    const key = 'planner_' + formatDateKey(date);
    return JSON.parse(localStorage.getItem(key)) || {
        tasks: HOURS.map(() => ({text: '', completed: false, missed: false})),
        notes: ''
    };
}

function savePlannerData(date, data) {
    const key = 'planner_' + formatDateKey(date);
    localStorage.setItem(key, JSON.stringify(data));
}

function updateDateDisplay() {
    const dateElem = document.getElementById('currentDate');
    dateElem.textContent = currentDate.toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'short', day:'numeric'});
}

function renderPlanner() {
    updateDateDisplay();
    const data = getPlannerData(currentDate);
    const planner = document.getElementById('planner');
    planner.innerHTML = '';
    const now = new Date();
    const todayKey = formatDateKey(new Date());
    const isToday = formatDateKey(currentDate) === todayKey;
    let completed = 0, total = HOURS.length;
    HOURS.forEach((h, idx) => {
        const row = document.createElement('div');
        row.className = 'hour-row';
        row.setAttribute('draggable', 'true');
        row.dataset.idx = idx;
        // Color coding
        if (data.tasks[idx].completed) {
            row.classList.add('task-completed');
            completed++;
        } else if (isToday && now.getHours() > h && data.tasks[idx].text) {
            row.classList.add('task-missed');
        } else if (data.tasks[idx].text) {
            row.classList.add('task-pending');
        }
        // Hour label
        const label = document.createElement('div');
        label.className = 'hour-label';
        label.textContent = HOUR_LABELS[idx];
        row.appendChild(label);
        // Task
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        // Task input
        const input = document.createElement('input');
        input.type = 'text';
        input.value = data.tasks[idx].text;
        input.placeholder = 'Add task...';
        input.addEventListener('change', e => {
            data.tasks[idx].text = input.value;
            savePlannerData(currentDate, data);
            renderPlanner();
        });
        taskDiv.appendChild(input);
        // Actions
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        // Complete
        const completeBtn = document.createElement('button');
        completeBtn.title = 'Mark as completed';
        completeBtn.innerHTML = data.tasks[idx].completed ? '<i class="fas fa-check-square"></i>' : '<i class="far fa-square"></i>';
        completeBtn.addEventListener('click', () => {
            data.tasks[idx].completed = !data.tasks[idx].completed;
            savePlannerData(currentDate, data);
            renderPlanner();
        });
        actions.appendChild(completeBtn);
        // Delete
        const delBtn = document.createElement('button');
        delBtn.title = 'Delete task';
        delBtn.innerHTML = '<i class="fas fa-trash"></i>';
        delBtn.addEventListener('click', () => {
            data.tasks[idx] = {text: '', completed: false, missed: false};
            savePlannerData(currentDate, data);
            renderPlanner();
        });
        actions.appendChild(delBtn);
        // Reminder
        const remindBtn = document.createElement('button');
        remindBtn.title = 'Set reminder';
        remindBtn.innerHTML = '<i class="fas fa-bell"></i>';
        remindBtn.addEventListener('click', () => {
            if (Notification.permission === 'granted') {
                scheduleReminder(idx, data.tasks[idx].text, h);
            } else {
                Notification.requestPermission().then(p => {
                    if (p === 'granted') scheduleReminder(idx, data.tasks[idx].text, h);
                });
            }
        });
        actions.appendChild(remindBtn);
        taskDiv.appendChild(actions);
        row.appendChild(taskDiv);
        // Drag-and-drop events
        row.addEventListener('dragstart', dragStart);
        row.addEventListener('dragover', dragOver);
        row.addEventListener('drop', dropTask);
        planner.appendChild(row);
    });
    // Progress bar
    const progress = document.getElementById('progress');
    progress.style.width = `${(completed/total)*100}%`;
    // Notes
    const notes = document.getElementById('dayNotes');
    notes.value = data.notes;
    renderPieChart();
}

function renderPieChart() {
    const data = getPlannerData(currentDate);
    const total = data.tasks.filter(t => t.text).length;
    const completed = data.tasks.filter(t => t.text && t.completed).length;
    const open = total - completed;
    const ctx = document.getElementById('progressPie').getContext('2d');
    ctx.clearRect(0, 0, 130, 130);
    if (total === 0) {
        // Draw empty circle
        ctx.beginPath();
        ctx.arc(65, 65, 60, 0, 2 * Math.PI);
        ctx.fillStyle = '#eee';
        ctx.fill();
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText('No Tasks', 65, 72);
        return;
    }
    // Completed slice
    const completedAngle = (completed / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(65, 65);
    ctx.arc(65, 65, 60, -0.5 * Math.PI, -0.5 * Math.PI + completedAngle, false);
    ctx.closePath();
    ctx.fillStyle = '#28a745';
    ctx.fill();
    // Open slice
    ctx.beginPath();
    ctx.moveTo(65, 65);
    ctx.arc(65, 65, 60, -0.5 * Math.PI + completedAngle, 1.5 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = '#ffc107';
    ctx.fill();
    // Outline
    ctx.beginPath();
    ctx.arc(65, 65, 60, 0, 2 * Math.PI);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Text
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText(`${completed}/${total}`, 65, 78);
}

// Navigation
function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    renderPlanner();
}

document.getElementById('prevDay').onclick = () => changeDay(-1);
document.getElementById('nextDay').onclick = () => changeDay(1);

document.getElementById('dayNotes').addEventListener('change', e => {
    const data = getPlannerData(currentDate);
    data.notes = e.target.value;
    savePlannerData(currentDate, data);
});

// Theme switcher
const themeSwitch = document.getElementById('themeSwitch');
let dark = false;
themeSwitch.onclick = () => {
    dark = !dark;
    document.body.style.setProperty('--bg', dark ? '#222' : '#f4f4f4');
    document.body.style.setProperty('--text', dark ? '#f4f4f4' : '#222');
    themeSwitch.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};

// Search/filter
function filterTasks() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;
    const planner = document.getElementById('planner');
    Array.from(planner.children).forEach((row, idx) => {
        const input = row.querySelector('input[type="text"]');
        const text = input.value.toLowerCase();
        let show = true;
        if (search && !text.includes(search)) show = false;
        if (status !== 'all') {
            if (status === 'completed' && !row.classList.contains('task-completed')) show = false;
            if (status === 'pending' && !row.classList.contains('task-pending')) show = false;
            if (status === 'missed' && !row.classList.contains('task-missed')) show = false;
        }
        row.style.display = show ? '' : 'none';
    });
}
document.getElementById('searchInput').addEventListener('input', filterTasks);
document.getElementById('filterStatus').addEventListener('change', filterTasks);

// Print/export
function printPlanner() {
    window.print();
}
document.getElementById('printBtn').onclick = printPlanner;

function exportPlanner() {
    const data = getPlannerData(currentDate);
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner_${formatDateKey(currentDate)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
document.getElementById('exportBtn').onclick = exportPlanner;

// Quick add
function populateQuickHours() {
    const sel = document.getElementById('quickHours');
    sel.innerHTML = '';
    HOURS.forEach((h, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = HOUR_LABELS[idx];
        sel.appendChild(opt);
    });
}
populateQuickHours();
document.getElementById('quickAddBtn').onclick = () => {
    const task = document.getElementById('quickTask').value;
    const sel = document.getElementById('quickHours');
    const selected = Array.from(sel.selectedOptions).map(o => +o.value);
    if (!task || selected.length === 0) return;
    const data = getPlannerData(currentDate);
    selected.forEach(idx => {
        data.tasks[idx].text = task;
        data.tasks[idx].completed = false;
    });
    savePlannerData(currentDate, data);
    renderPlanner();
    document.getElementById('quickTask').value = '';
    sel.selectedIndex = -1;
};

// Drag-and-drop
let dragSrcIdx = null;
function dragStart(e) {
    dragSrcIdx = +e.currentTarget.dataset.idx;
    e.dataTransfer.effectAllowed = 'move';
}
function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}
function dropTask(e) {
    e.preventDefault();
    const tgtIdx = +e.currentTarget.dataset.idx;
    if (dragSrcIdx === null || dragSrcIdx === tgtIdx) return;
    const data = getPlannerData(currentDate);
    const temp = data.tasks[dragSrcIdx];
    data.tasks[dragSrcIdx] = data.tasks[tgtIdx];
    data.tasks[tgtIdx] = temp;
    savePlannerData(currentDate, data);
    renderPlanner();
    dragSrcIdx = null;
}

// Initial render
renderPlanner();

// Re-filter after render
const observer = new MutationObserver(filterTasks);
observer.observe(document.getElementById('planner'), {childList: true, subtree: false});

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
