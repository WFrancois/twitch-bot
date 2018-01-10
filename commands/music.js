const config = require('config');
const twitchApi = require('../libs/twitch.js');
const {Client} = require('pg');

module.exports.getMessage = function (channel) {
    return new Promise((resolve, reject) => {
        twitchApi.isOnline(channel).then((online) => {
            if(!online) {
                return resolve('stream not online :(');
            }

            const client = new Client(config.get('db.music'));
            client.connect();

            client.query('SELECT * FROM current_music WHERE channel = $1', [channel]).then(function (rows) {
                client.end();
                if (rows && rows.rows && rows.rows[0]) {
                    return resolve(rows.rows[0].title)
                } else {
                    return reject('not-found');
                }
            }).catch(reject);
        });
    });
};