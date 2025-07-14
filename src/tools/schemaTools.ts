import { dbAll, getListTablesQuery, getDescribeTableQuery } from '../db/index.js';

export const listTablesTool = {
  name: "list_tables",
  description: "Get a list of all tables in the database",
  inputSchema: {
    type: "object",
    properties: {},
  },
  async execute() {
    try {
      const query = getListTablesQuery();
      const tables = await dbAll(query);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(tables.map((t: any) => Object.values(t)[0]), null, 2) 
        }],
        isError: false,
      };
    } catch (error: any) {
      throw new Error(`Error listing tables: ${error.message}`);
    }
  },
};

export const describeTableTool = {
  name: "describe_table",
  description: "View schema information for a specific table",
  inputSchema: {
    type: "object",
    properties: {
      table_name: { type: "string" },
    },
    required: ["table_name"],
  },
  async execute(args: { table_name: string }) {
    if (!args.table_name) {
      throw new Error("Table name is required");
    }

    try {
      const query = getDescribeTableQuery(args.table_name);
      const columns = await dbAll(query);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(columns, null, 2) 
        }],
        isError: false,
      };
    } catch (error: any) {
      throw new Error(`Error describing table: ${error.message}`);
    }
  },
};