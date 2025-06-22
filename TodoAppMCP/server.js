const MCPServer = require('./mcp-server');
const WebServer = require('./web-server');

async function startServers() {
    try {
        // Create and start MCP server on port 8080
        const mcpServer = new MCPServer();
        await mcpServer.start(8080);
        console.log('MCP Server started successfully');

        // Create and start web server on port 3000
        const webServer = new WebServer();
        await webServer.start(3000);
        console.log('Web Server started successfully');

        console.log('\nAll servers are running:');
        console.log('- Web App: http://localhost:3000');
        console.log('- MCP API: http://localhost:8080');
        console.log('- MCP Protocol: http://localhost:8080/protocol');
    } catch (error) {
        console.error('Failed to start servers:', error);
        process.exit(1);
    }
}

// Start both servers
startServers(); 