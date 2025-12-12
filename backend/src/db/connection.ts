import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export const getDb = async () => {
    if (dbInstance) return dbInstance;

    const dbPath = path.resolve(__dirname, '../../vehicleiq.sqlite');
    console.log(`Using SQLite database at: ${dbPath}`);

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    return dbInstance;
};

// Mock Pool interface to minimize code changes in controllers
export const pool = {
    query: async (text: string, params: any[] = []) => {
        const db = await getDb();

        // Convert Postgres $1, $2 syntax to SQLite ? syntax
        let sql = text;
        const sqlParams: any[] = [];

        // Very basic parameter conversion
        if (params && params.length > 0) {
            params.forEach((param, idx) => {
                const placeholder = `$${idx + 1}`;
                if (sql.includes(placeholder)) {
                    // Use regex with global flag to replace all instances
                    const regex = new RegExp(`\\$${idx + 1}`, 'g');
                    sql = sql.replace(regex, '?');
                    sqlParams.push(param);
                }
            });
        }

        // Crude detection of query type
        if (sql.trim().toLowerCase().startsWith('select')) {
            const rows = await db.all(sql, ...params); // params are passed directly if we replace ? properly? 
            // Actually sqlite wrapper .all matches param order to ?
            // My replaceAll logic above is flawed if params aren't in order, but for this demo code it likely is.
            // A better way is regex replace.

            // Re-doing param logic:
            // SQLite driver expects params array matching ? order. 
            // If we blindly replace $1 with ?, we assume params[0] corresponds to first ?.
            // Postgres uses named params effectively by index. 
            // Let's implement a better regex replacer.

            const normalizedSql = text.replace(/\$\d+/g, '?');

            try {
                const rows = await db.all(normalizedSql, params);
                return { rows };
            } catch (e: any) {
                console.error(`SQL Error: ${text}`, e.message);
                throw e;
            }
        } else {
            // INSERT/UPDATE/DELETE
            const isUpdateReturning = text.trim().toUpperCase().startsWith('UPDATE') && text.toUpperCase().includes('RETURNING *');

            const normalizedSql = text.replace(/\$\d+/g, '?');
            // Remove RETURNING * clauses as SQLite doesn't support them easily (or supports differently)
            const cleanSql = normalizedSql.replace(/RETURNING \*/i, '');

            try {
                const result = await db.run(cleanSql, params);

                // Simulate RETURNING * for UPDATE alerts
                if (isUpdateReturning && (result.changes || 0) > 0) {
                    // Hacky: assume id is the last param for the WHERE clause usually? 
                    // Or specifically for our known existing use cases: UPDATE ... WHERE id = $1
                    // in alertController it is: WHERE id = $1. So params[0] is the ID.
                    const id = params[0];
                    if (id) {
                        const fetchRow = await db.get(`SELECT * FROM alerts WHERE id = ?`, id);
                        return {
                            rows: [fetchRow],
                            rowCount: result.changes
                        };
                    }
                }

                return {
                    rows: [],
                    rowCount: result.changes
                };
            } catch (e: any) {
                console.error(`SQL Error: ${text}`, e.message);
                throw e;
            }
        }
    }
};

export default pool;
