import { randomUUID } from "crypto";
import pg from "pg";
import { config } from "../config.js";

const { Pool } = pg;

const createPool = () => {
  if (!config.databaseUrl) return null;
  return new Pool({ connectionString: config.databaseUrl });
};

export class TransactionStore {
  constructor() {
    this.pool = createPool();
    this.memory = new Map();
  }

  async init() {
    if (!this.pool) return;
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY,
        method SMALLINT NOT NULL,
        amount NUMERIC NOT NULL,
        status TEXT NOT NULL,
        callback TEXT,
        token_checksum TEXT NOT NULL,
        payment_url TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  }

  async create(record) {
    const id = record.id || randomUUID();
    const entry = { ...record, id, createdAt: new Date(), updatedAt: new Date() };
    this.memory.set(id, entry);
    if (this.pool) {
      await this.pool.query(
        `INSERT INTO transactions (id, method, amount, status, callback, token_checksum, payment_url, expires_at, metadata)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          id,
          record.method,
          record.amount,
          record.status,
          record.callback,
          record.tokenChecksum,
          record.paymentUrl,
          record.expiresAt,
          record.metadata || {},
        ]
      );
    }
    return entry;
  }

  async update(id, updates) {
    const existing = this.memory.get(id);
    if (!existing) return null;
    const merged = { ...existing, ...updates, updatedAt: new Date() };
    this.memory.set(id, merged);
    if (this.pool) {
      // Only status + metadata are persisted back to PostgreSQL to keep the update scope minimal.
      await this.pool.query(
        `UPDATE transactions SET status=$2, metadata=$3, updated_at=NOW() WHERE id=$1`,
        [id, merged.status, merged.metadata || {}]
      );
    }
    return merged;
  }

  async get(id) {
    if (this.memory.has(id)) return this.memory.get(id);
    if (!this.pool) return null;
    const result = await this.pool.query(`SELECT * FROM transactions WHERE id=$1`, [id]);
    if (!result.rows.length) return null;
    const row = result.rows[0];
    const mapped = {
      id: row.id,
      method: Number(row.method),
      amount: Number(row.amount),
      status: row.status,
      callback: row.callback,
      tokenChecksum: row.token_checksum,
      paymentUrl: row.payment_url,
      expiresAt: row.expires_at,
      metadata: row.metadata || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    this.memory.set(mapped.id, mapped);
    return mapped;
  }
}
