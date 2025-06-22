// Enhanced TODO app logic with all requested features
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const descInput = document.getElementById('todo-desc');
const dueInput = document.getElementById('todo-due');
const priorityInput = document.getElementById('todo-priority');
const list = document.getElementById('todo-list');
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');
const searchInput = document.getElementById('search-input');

let currentFilter = 'all';
let searchTerm = '';

function getTodos() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
}

function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    list.innerHTML = '';
    let todos = getTodos();
    if (searchTerm) {
        todos = todos.filter(todo =>
            todo.title.toLowerCase().includes(searchTerm) ||
            (todo.desc && todo.desc.toLowerCase().includes(searchTerm))
        );
    }
    if (currentFilter === 'active') {
        todos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        todos = todos.filter(todo => todo.completed);
    }
    // Sort by priority and due date
    todos.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.due && b.due) return a.due.localeCompare(b.due);
        if (a.due) return -1;
        if (b.due) return 1;
        return 0;
    });
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.style.background = todo.completed ? '#e0ffe0' : '';
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!todo.completed;
        checkbox.onchange = () => toggleComplete(idx);
        li.appendChild(checkbox);
        // Title and desc
        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.marginLeft = '8px';
        content.innerHTML = `<strong>${todo.title}</strong>` +
            (todo.desc ? `<br><small>${todo.desc}</small>` : '') +
            (todo.due ? `<br><small>Due: ${todo.due}</small>` : '') +
            `<br><small>Priority: ${todo.priority}</small>`;
        li.appendChild(content);
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.marginRight = '4px';
        editBtn.onclick = () => editTodo(idx);
        li.appendChild(editBtn);
        // Remove button
        const btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.className = 'remove';
        btn.onclick = () => removeTodo(idx);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

function addTodo(todo) {
    const todos = getTodos();
    todos.push(todo);
    saveTodos(todos);
    renderTodos();
}

function removeTodo(idx) {
    const todos = getTodos();
    todos.splice(idx, 1);
    saveTodos(todos);
    renderTodos();
}

function toggleComplete(idx) {
    const todos = getTodos();
    todos[idx].completed = !todos[idx].completed;
    saveTodos(todos);
    renderTodos();
}

function editTodo(idx) {
    const todos = getTodos();
    const todo = todos[idx];
    input.value = todo.title;
    descInput.value = todo.desc || '';
    dueInput.value = todo.due || '';
    priorityInput.value = todo.priority || 'medium';
    form.onsubmit = function(e) {
        e.preventDefault();
        todo.title = input.value.trim();
        todo.desc = descInput.value.trim();
        todo.due = dueInput.value;
        todo.priority = priorityInput.value;
        saveTodos(todos);
        renderTodos();
        form.onsubmit = defaultSubmit;
        form.reset();
    };
}

function defaultSubmit(e) {
    e.preventDefault();
    const value = input.value.trim();
    if (value) {
        addTodo({
            title: value,
            desc: descInput.value.trim(),
            due: dueInput.value,
            priority: priorityInput.value,
            completed: false
        });
        form.reset();
    }
}

form.onsubmit = defaultSubmit;

filterAll.onclick = () => { currentFilter = 'all'; renderTodos(); };
filterActive.onclick = () => { currentFilter = 'active'; renderTodos(); };
filterCompleted.onclick = () => { currentFilter = 'completed'; renderTodos(); };
searchInput.oninput = () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTodos();
};

// Initial render
renderTodos();
