// src/routes/data.js
const express = require('express');
const router = express.Router();
const knex = require('../db/knex-client');
const { bulkData } = require('../utils/fake');

router.post('/insert-partition/:count', async (req, res) => {
    console.log('Inserting data...');
    const count = parseInt(req.params.count, 10) || 1000;
    const rows = await bulkData(count);
    try {
        const chunkSize = 1000;
        for (let i = 0; i < rows.length; i += chunkSize) {
            await knex('events').insert(rows.slice(i, i + chunkSize));
        }
        res.json({ inserted: count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/query-partition', async (req, res) => {
    console.log('Querying partitioned table...');
    console.time('time-range');
    const start = Date.now();
    const rows = await knex('events')
        .whereBetween('event_date', ['2025-02-01', '2025-02-28'])
        .select('*');
    console.timeEnd('time-range');
    let endtime = Date.now() - start;
    res.json({
        count: rows.length,
        time: endtime
    });
});

router.get('/query-non-partition', async (req, res) => {
    console.log('Querying non-partitioned table...');
    console.time('time-range');
    const start = Date.now();
    const rows = await knex('events_full')
        .whereBetween('event_date', ['2025-02-01', '2025-02-28'])
        .select('*');
    console.timeEnd('time-range');
    let endtime = Date.now() - start;
    res.json({
        count: rows.length,
        time: endtime
    });
});

router.get('/move-data', async (req, res) => {
    try {
        await knex.raw(`
            INSERT INTO events_full (id, user_id, event_date, amount, status)
            SELECT id, user_id, event_date, amount, status FROM events;
        `);
        res.json({ message: 'Data moved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
