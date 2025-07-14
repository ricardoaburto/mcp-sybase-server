import { exec } from 'child_process';
import { promisify } from 'util';
import { DbAdapter } from './adapter.js';

const execPromise = promisify(exec);

export class SybaseAdapter implements DbAdapter {
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    init(): Promise<void> {
        // La conexión se establece por cada consulta en este adaptador
        return Promise.resolve();
    }

    close(): Promise<void> {
        // La desconexión se maneja por cada consulta en este adaptador
        return Promise.resolve();
    }

    all(query: string, params?: any[]): Promise<any[]> {
        const { host, port, database, user, password } = this.config;
        const command = `java -cp "lib/jtds-1.3.1.jar;." SybaseQuery "${host}" "${port}" "${database}" "${user}" "${password}" "${query}"`;

        return execPromise(command).then(({ stdout }) => {
            return JSON.parse(stdout);
        });
    }

    run(query: string, params?: any[]): Promise<{ changes: number, lastID: number }> {
        // La operación de escritura no está soportada en este adaptador de solo lectura
        return Promise.resolve({ changes: 0, lastID: 0 });
    }

    exec(query: string): Promise<void> {
        // La operación de ejecución no está soportada en este adaptador de solo lectura
        return Promise.resolve();
    }

    getMetadata(): { name: string; type: string; path?: string; server?: string; database?: string; } {
        return {
            name: this.config.database,
            type: 'sybase',
            server: this.config.host,
            database: this.config.database,
        };
    }

    getListTablesQuery(): string {
        return "SELECT name FROM sysobjects WHERE type = 'U'";
    }

    getDescribeTableQuery(tableName: string): string {
        return `SELECT c.name AS column_name, t.name AS data_type, c.length FROM syscolumns c JOIN systypes t ON c.usertype = t.usertype JOIN sysobjects o ON c.id = o.id WHERE o.name = '${tableName}' AND o.type = 'U'`;
    }
}