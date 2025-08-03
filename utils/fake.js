const faker = require('@faker-js/faker').faker;

function generateRow() {
    return {
        user_id: faker.number.int({ min: 1, max: 1000000 }),
        event_date: faker.date.between({
            from: new Date('2024-01-01'),
            to: new Date('2025-12-31')
        }),
        amount: faker.number.float({ min: 0, max: 1000, precision: 0.01 }).toFixed(2),
        status: faker.helpers.arrayElement(['pending', 'done', 'failed'])
    };
}

async function bulkData(n = 100000) {
    const rows = [];
    for (let i = 0; i < n; i++) {
        rows.push(generateRow());
    }
    return rows;
}

module.exports = { bulkData };