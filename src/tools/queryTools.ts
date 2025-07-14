import { dbAll } from '../db/index.js';

export const queryTool = {
  name: "query",
  description: "Execute SELECT queries to read data from the database",
  inputSchema: {
    type: "object",
    properties: {
      sql: { type: "string" },
    },
    required: ["sql"],
  },
  async execute(args: { sql: string }) {
    try {
      const result = await dbAll(args.sql);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        isError: false,
      };
    } catch (error: any) {
      throw new Error(`SQL Error: ${error.message}`);
    }
  },
};