const knex = require('./knex-client');

async function ensurePartitionedTable() {
  const exists = await knex.schema.hasTable('events');
  if (!exists) {
    await knex.raw(`
      CREATE TABLE events (
        id         BIGINT       NOT NULL AUTO_INCREMENT,
        user_id    INT          NOT NULL,
        event_date DATE         NOT NULL,
        amount     DECIMAL(10,2),
        status     VARCHAR(16),
        PRIMARY KEY (id, event_date)
      )
        PARTITION BY RANGE COLUMNS(event_date) (
        PARTITION p202401 VALUES LESS THAN ('2024-02-01'),
        PARTITION p202402 VALUES LESS THAN ('2024-03-01'),
        PARTITION p202403 VALUES LESS THAN ('2024-04-01'),
        PARTITION p202404 VALUES LESS THAN ('2024-05-01'),
        PARTITION p202405 VALUES LESS THAN ('2024-06-01'),
        PARTITION p202406 VALUES LESS THAN ('2024-07-01'),
        PARTITION p202407 VALUES LESS THAN ('2024-08-01'),
        PARTITION p202408 VALUES LESS THAN ('2024-09-01'),
        PARTITION p202409 VALUES LESS THAN ('2024-10-01'),
        PARTITION p202410 VALUES LESS THAN ('2024-11-01'),
        PARTITION p202411 VALUES LESS THAN ('2024-12-01'),
        PARTITION p202412 VALUES LESS THAN ('2025-01-01'),
        PARTITION p202501 VALUES LESS THAN ('2025-02-01'),
        PARTITION p202502 VALUES LESS THAN ('2025-03-01'),
        PARTITION p202503 VALUES LESS THAN ('2025-04-01'),
        PARTITION p202504 VALUES LESS THAN ('2025-05-01'),
        PARTITION p202505 VALUES LESS THAN ('2025-06-01'),
        PARTITION p202506 VALUES LESS THAN ('2025-07-01'),
        PARTITION pMax    VALUES LESS THAN (MAXVALUE)
      );
    `);
    console.log('Created partitioned table events');
  }
}

async function ensureNonPartitionedTable() {
  const exists = await knex.schema.hasTable('events_full');
  if (!exists) {
    await knex.raw(`
      CREATE TABLE events_full (
        id         BIGINT       NOT NULL AUTO_INCREMENT,
        user_id    INT          NOT NULL,
        event_date DATE         NOT NULL,
        amount     DECIMAL(10,2),
        status     VARCHAR(16),
        PRIMARY KEY (id, event_date)
      );
    `);
    console.log('Created non-partitioned table events_full');
  }
}

async function setup() {
  try {
    await ensurePartitionedTable();
    await ensureNonPartitionedTable();
  } catch (err) {
    console.error('Error setting up tables:', err);
  } finally {
    await knex.destroy();
  }
}

setup();