#!/usr/bin/env bun
/**
 * The catalog MCP server over stdio, for local development against your own
 * database. The hosted equivalent is `app/api/mcp/route.ts`, which needs no
 * credentials from the person connecting to it.
 *
 * Register it with Claude Code:
 *   claude mcp add catalog -- bun run /absolute/path/to/mcp/server.ts
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCatalogTools, SERVER_INFO } from "./tools";

const server = new McpServer(SERVER_INFO);
registerCatalogTools(server);

await server.connect(new StdioServerTransport());
