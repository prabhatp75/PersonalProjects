const fs = require('fs');
const path = require('path');

class DataStore {
    constructor() {
        this.todos = [];
        this.listeners = new Set();
        this.dataFile = path.join(__dirname, 'todos.json');
        
        // Load data from file for server-side
        if (typeof window === 'undefined') {
            this.loadFromFile();
        }
        // Load data from localStorage for client-side
        else if (window.localStorage) {
            const savedTodos = localStorage.getItem('todos');
            if (savedTodos) {
                this.todos = JSON.parse(savedTodos);
            }
        }
    }

    // Load data from file (server-side)
    loadFromFile() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const data = fs.readFileSync(this.dataFile, 'utf8');
                this.todos = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading data from file:', error);
        }
    }

    // Save data to file (server-side)
    saveToFile() {
        if (typeof window === 'undefined') {
            try {
                fs.writeFileSync(this.dataFile, JSON.stringify(this.todos, null, 2));
            } catch (error) {
                console.error('Error saving data to file:', error);
            }
        }
    }

    // Subscribe to data changes
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    // Notify all listeners of changes
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.todos));
        
        // Save to localStorage if in browser
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        }
        // Save to file if on server
        else {
            this.saveToFile();
        }
    }

    // CRUD operations
    getAllTodos() {
        return [...this.todos];
    }

    addTodo(todo) {
        const newTodo = {
            ...todo,
            id: Date.now().toString(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.todos.unshift(newTodo);
        this.notifyListeners();
        return newTodo;
    }

    updateTodo(id, updates) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index !== -1) {
            this.todos[index] = {
                ...this.todos[index],
                ...updates,
                id // Prevent ID from being updated
            };
            this.notifyListeners();
            return this.todos[index];
        }
        return null;
    }

    deleteTodo(id) {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter(t => t.id !== id);
        const deleted = this.todos.length < initialLength;
        if (deleted) {
            this.notifyListeners();
        }
        return deleted;
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        this.todos = this.todos.filter(t => !t.completed);
        this.notifyListeners();
        return completedCount;
    }

    getFilteredAndSortedTodos(filter, sort) {
        let result = [...this.todos];

        // Apply filters
        if (filter === 'active') {
            result = result.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            result = result.filter(todo => todo.completed);
        }

        // Apply sorting
        if (sort) {
            result.sort((a, b) => {
                switch (sort) {
                    case 'date':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'priority':
                        const priorityOrder = { high: 3, medium: 2, low: 1 };
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                    case 'category':
                        return a.category.localeCompare(b.category);
                    default:
                        return 0;
                }
            });
        }

        return result;
    }

    getStatistics() {
        return {
            total: this.todos.length,
            active: this.todos.filter(t => !t.completed).length,
            completed: this.todos.filter(t => t.completed).length,
            byPriority: {
                high: this.todos.filter(t => t.priority === 'high').length,
                medium: this.todos.filter(t => t.priority === 'medium').length,
                low: this.todos.filter(t => t.priority === 'low').length
            },
            byCategory: {
                personal: this.todos.filter(t => t.category === 'personal').length,
                work: this.todos.filter(t => t.category === 'work').length,
                shopping: this.todos.filter(t => t.category === 'shopping').length,
                health: this.todos.filter(t => t.category === 'health').length,
                other: this.todos.filter(t => t.category === 'other').length
            }
        };
    }
}

// Create a singleton instance
const store = new DataStore();

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = store;
} else {
    window.todoStore = store;
} 