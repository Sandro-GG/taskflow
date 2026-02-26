import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ 
    connectionString,
    application_name: 'taskflow_server' 
});

const adapter = new PrismaPg(pool);

export const client = new PrismaClient({ adapter });