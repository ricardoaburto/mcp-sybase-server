import { SybaseAdapter } from './sybase-adapter.js';

export interface DbAdapter {
  init(): Promise<void>;
  close(): Promise<void>;
  all(query: string, params?: any[]): Promise<any[]>;
  run(query: string, params?: any[]): Promise<{ changes: number, lastID: number }>;
  exec(query: string): Promise<void>;
  getMetadata(): { name: string, type: string, path?: string, server?: string, database?: string };
  getListTablesQuery(): string;
  getDescribeTableQuery(tableName: string): string;
}

export function createDbAdapter(connectionInfo: any): DbAdapter {
  return new SybaseAdapter(connectionInfo);
}