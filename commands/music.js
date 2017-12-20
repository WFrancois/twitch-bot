const config = require('config');
const {Client} = require('pg');

module.exports.getMessage = function () {
    return new Promise((resolve, reject) => {
        const client = new Client(config.get('db.music'));
        client.connect();

        client.query('SELECT * FROM current_music WHERE channel = $1', ['w_lapin']).then(function (rows) {
            if (rows && rows.rows && rows.rows[0]) {
                return resolve(rows.rows[0].title)
            } else {
                return reject('not-found');
            }
        }).catch(console.warn);
    });
};