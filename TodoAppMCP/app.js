// Todo Class to represent a todo item
class Todo {
    constructor(title, description, dueDate, priority, category) {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.category = category;
        this.completed = false;
        this.createdAt = new Date();
    }
}

// TodoApp Class to manage the application
class TodoApp {
    constructor() {
        this.todos = [];
        this.filter = 'all';
        this.sortBy = 'date';
        this.mcpBaseUrl = 'http://localhost:8080'; // MCP server URL
        
        // DOM Elements
        this.todoForm = document.getElementById('todoForm');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.sortSelect = document.getElementById('sortBy');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        
        this.initializeEventListeners();
        this.loadTodos();
    }

    initializeEventListeners() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.loadTodos();
            });
        });

        // Sort selection
        this.sortSelect.addEventListener('change', () => {
            this.sortBy = this.sortSelect.value;
            this.loadTodos();
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });
    }

    async loadTodos() {
        try {
            const response = await fetch(`${this.mcpBaseUrl}/todos?filter=${this.filter}&sort=${this.sortBy}`);
            if (!response.ok) throw new Error('Failed to load todos');
            this.todos = await response.json();
            this.render();
        } catch (error) {
            console.error('Error loading todos:', error);
        }
    }

    async addTodo() {
        const title = document.getElementById('todoTitle').value.trim();
        if (!title) return;

        const todo = {
            title,
            description: document.getElementById('todoDescription').value.trim(),
            dueDate: document.getElementById('dueDate').value,
            priority: document.getElementById('priority').value,
            category: document.getElementById('category').value
        };

        try {
            const response = await fetch(`${this.mcpBaseUrl}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            });

            if (!response.ok) throw new Error('Failed to add todo');
            this.todoForm.reset();
            await this.loadTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    async toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            try {
                const response = await fetch(`${this.mcpBaseUrl}/todos/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        completed: !todo.completed
                    })
                });

                if (!response.ok) throw new Error('Failed to update todo');
                await this.loadTodos();
            } catch (error) {
                console.error('Error toggling todo:', error);
            }
        }
    }

    async deleteTodo(id) {
        try {
            const response = await fetch(`${this.mcpBaseUrl}/todos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete todo');
            await this.loadTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    async editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            document.getElementById('todoTitle').value = todo.title;
            document.getElementById('todoDescription').value = todo.description || '';
            document.getElementById('dueDate').value = todo.dueDate || '';
            document.getElementById('priority').value = todo.priority;
            document.getElementById('category').value = todo.category;
            
            await this.deleteTodo(id);
            window.scrollTo(0, 0);
        }
    }

    async clearCompleted() {
        try {
            const response = await fetch(`${this.mcpBaseUrl}/todos/clear-completed`, {
                method: 'POST'
            });

            if (!response.ok) throw new Error('Failed to clear completed todos');
            await this.loadTodos();
        } catch (error) {
            console.error('Error clearing completed todos:', error);
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    renderTodoItem(todo) {
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}">
                <input type="checkbox" class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    onchange="todoApp.toggleTodo('${todo.id}')">
                <div class="todo-content">
                    <div class="todo-title">${todo.title}</div>
                    ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                    <div class="todo-meta">
                        ${todo.dueDate ? `Due: ${this.formatDate(todo.dueDate)} • ` : ''}
                        Priority: ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} • 
                        Category: ${todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                    </div>
                </div>
                <div class="todo-actions">
                    <button onclick="todoApp.editTodo('${todo.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="todoApp.deleteTodo('${todo.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    render() {
        const activeTodos = this.todos.filter(todo => !todo.completed);
        const completedTodos = this.todos.filter(todo => todo.completed);

        // Update todo count
        const activeCount = activeTodos.length;
        document.getElementById('todoCount').textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;

        // Render both active and completed sections
        this.todoList.innerHTML = `
            <h2 class="section-title">Active Tasks (${activeTodos.length})</h2>
            <div class="active-todos">
                ${activeTodos.map(todo => this.renderTodoItem(todo)).join('')}
                ${activeTodos.length === 0 ? '<div class="empty-message">No active tasks</div>' : ''}
            </div>
            
            <h2 class="section-title">Completed Tasks (${completedTodos.length})</h2>
            <div class="completed-todos">
                ${completedTodos.map(todo => this.renderTodoItem(todo)).join('')}
                ${completedTodos.length === 0 ? '<div class="empty-message">No completed tasks</div>' : ''}
            </div>
        `;
    }
}

// Initialize the app
const todoApp = new TodoApp();