const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const store = require('./dataStore');

class MCPServer {
    constructor() {
        this.app = express();
        
        // Enable all CORS requests
        this.app.use(cors());
        
        // Parse JSON bodies
        this.app.use(bodyParser.json());
        
        // Basic error handling
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Something went wrong!' });
        });
        
        this.setupMCPRoutes();
    }

    setupMCPRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok' });
        });

        // MCP Protocol Definition
        this.app.get('/protocol', (req, res) => {
            res.json({
                name: "TODO-MCP",
                version: "1.0",
                description: "Model Context Protocol for TODO Application",
                operations: {
                    "list_todos": {
                        description: "List all todos with optional filters",
                        parameters: {
                            filter: "string?", // active, completed, all
                            sort: "string?",   // date, priority, category
                        },
                        returns: "array<Todo>"
                    },
                    "add_todo": {
                        description: "Create a new todo item",
                        parameters: {
                            title: "string",
                            description: "string?",
                            dueDate: "string?",
                            priority: "enum(low,medium,high)",
                            category: "enum(personal,work,shopping,health,other)"
                        },
                        returns: "Todo"
                    },
                    "update_todo": {
                        description: "Update an existing todo item",
                        parameters: {
                            id: "string",
                            title: "string?",
                            description: "string?",
                            dueDate: "string?",
                            priority: "string?",
                            category: "string?",
                            completed: "boolean?"
                        },
                        returns: "Todo"
                    },
                    "delete_todo": {
                        description: "Delete a todo item",
                        parameters: {
                            id: "string"
                        },
                        returns: "boolean"
                    },
                    "clear_completed": {
                        description: "Remove all completed todos",
                        parameters: {},
                        returns: "number"
                    },
                    "get_statistics": {
                        description: "Get todo statistics",
                        parameters: {},
                        returns: {
                            total: "number",
                            active: "number",
                            completed: "number",
                            byPriority: "object",
                            byCategory: "object"
                        }
                    }
                },
                types: {
                    Todo: {
                        id: "string",
                        title: "string",
                        description: "string?",
                        dueDate: "string?",
                        priority: "string",
                        category: "string",
                        completed: "boolean",
                        createdAt: "string"
                    }
                }
            });
        });

        // Implementation of MCP operations
        this.app.get('/todos', this.listTodos.bind(this));
        this.app.post('/todos', this.addTodo.bind(this));
        this.app.put('/todos/:id', this.updateTodo.bind(this));
        this.app.delete('/todos/:id', this.deleteTodo.bind(this));
        this.app.post('/todos/clear-completed', this.clearCompleted.bind(this));
        this.app.get('/todos/statistics', this.getStatistics.bind(this));
    }

    async listTodos(req, res) {
        try {
            const { filter, sort } = req.query;
            const todos = store.getFilteredAndSortedTodos(filter, sort);
            res.json(todos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addTodo(req, res) {
        try {
            const { title, description, dueDate, priority, category } = req.body;
            
            if (!title) {
                return res.status(400).json({ error: "Title is required" });
            }

            const todo = store.addTodo({
                title,
                description: description || "",
                dueDate: dueDate || null,
                priority: priority || "medium",
                category: category || "personal"
            });

            res.status(201).json(todo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateTodo(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            const updatedTodo = store.updateTodo(id, updates);
            if (!updatedTodo) {
                return res.status(404).json({ error: "Todo not found" });
            }

            res.json(updatedTodo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteTodo(req, res) {
        try {
            const { id } = req.params;
            const deleted = store.deleteTodo(id);
            
            if (!deleted) {
                return res.status(404).json({ error: "Todo not found" });
            }

            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async clearCompleted(req, res) {
        try {
            const count = store.clearCompleted();
            res.json({ count });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getStatistics(req, res) {
        try {
            const stats = store.getStatistics();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    start(port) {
        return new Promise((resolve, reject) => {
            try {
                const server = this.app.listen(port, () => {
                    console.log(`MCP Server running on port ${port}`);
                    console.log(`MCP Protocol: http://localhost:${port}/protocol`);
                    resolve(server);
                });

                server.on('error', (error) => {
                    console.error('Failed to start MCP server:', error);
                    reject(error);
                });
            } catch (error) {
                console.error('Failed to start MCP server:', error);
                reject(error);
            }
        });
    }
}

module.exports = MCPServer; 