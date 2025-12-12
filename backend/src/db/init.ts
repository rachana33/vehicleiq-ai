import fs from 'fs';
import path from 'path';
import { getDb } from './connection';

export const initializeDatabase = async () => {
    try {
        const db = await getDb();
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to run statements individually (better for SQLite)
        const statements = schemaSql.split(';').filter(stmt => stmt.trim().length > 0);

        console.log('Initializing SQLite database...');
        for (const stmt of statements) {
            await db.run(stmt);
        }
        console.log('SQLite database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};
