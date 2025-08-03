const knex = require('knex');

const knexConn = knex({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'admin',
        password: 'password',
        database: 'mydb'
    },
    pool: { min: 2, max: 10 }
});

module.exports = knexConn;