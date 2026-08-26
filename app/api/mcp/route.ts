import { createMcpHandler } from "mcp-handler";
import { registerCatalogTools, SERVER_INFO } from "@/mcp/tools";

/**
 * The catalog MCP server, hosted.
 *
 * The database credentials live in this deployment's environment, so anyone
 * can point an agent at this url without provisioning anything:
 *
 *   claude mcp add --transport http catalog https://catalog.builtwell.design/api/mcp
 *
 * Stateless: no session store, so every request stands alone and there is
 * nothing to keep warm between them.
 */
const handler = createMcpHandler(
  registerCatalogTools,
  { serverInfo: SERVER_INFO },
  // Endpoints are derived from the base path: this route answers /api/mcp.
  { basePath: "/api", disableSse: true }
);

export { handler as GET, handler as POST, handler as DELETE };
