const express = require('express');
const path = require('path');

class WebServer {
    constructor() {
        this.app = express();
        
        // Basic error handling
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something went wrong!');
        });
        
        this.setupWebRoutes();
    }

    setupWebRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({ status: 'ok' });
        });

        // Serve static files
        this.app.use(express.static(path.join(__dirname)));
        
        // Serve index.html for all routes (SPA)
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    }

    start(port) {
        return new Promise((resolve, reject) => {
            try {
                const server = this.app.listen(port, () => {
                    console.log(`Web Server running on port ${port}`);
                    console.log(`Web App: http://localhost:${port}`);
                    resolve(server);
                });

                server.on('error', (error) => {
                    console.error('Failed to start web server:', error);
                    reject(error);
                });
            } catch (error) {
                console.error('Failed to start web server:', error);
                reject(error);
            }
        });
    }
}

module.exports = WebServer; 