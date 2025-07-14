import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { initDatabase, dbAll, getDatabaseMetadata, getListTablesQuery, getDescribeTableQuery } from './db/index.js';
import { queryTool } from './tools/queryTools.js';
import { listTablesTool, describeTableTool } from './tools/schemaTools.js';

const server = new Server(
  {
    name: "@executedatabase/sybase-server",
    version: "1.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: <connection_details>");
  process.exit(1);
}

const connectionString = args[0];

let connectionConfig: any;

try {
    connectionConfig = JSON.parse(connectionString);
} catch (error) {
    console.error("Invalid connection details format. Please provide a valid JSON string.");
    process.exit(1);
}

const tools = [queryTool, listTablesTool, describeTableTool];

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const query = getListTablesQuery();
  const result = await dbAll(query);
  const { name: dbName } = getDatabaseMetadata();
  const resourceBaseUrl = new URL(`sybase://${dbName}`);

  return {
    resources: result.map((row) => ({
      uri: new URL(`${Object.values(row)[0]}/schema`, resourceBaseUrl).href,
      mimeType: "application/json",
      name: `\"${Object.values(row)[0]}\" database schema`,
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resourceUrl = new URL(request.params.uri);

  const pathComponents = resourceUrl.pathname.split("/");
  const schema = pathComponents.pop();
  const tableName = pathComponents.pop();

  if (schema !== "schema") {
    throw new Error("Invalid resource URI");
  }

  const query = getDescribeTableQuery(tableName!);
  const result = await dbAll(query);

  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: "application/json",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find((t) => t.name === request.params.name);
  if (!tool) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }
  return tool.execute(request.params.arguments as any);
});

async function runServer() {
  try {
    await initDatabase(connectionConfig);
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Failed to initialize:", error);
    process.exit(1);
  }
}

runServer().catch(console.error);
