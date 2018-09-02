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

            client.query('SELECT * FROM current_music WHERE channel = $1 AND last_update > (NOW() AT TIME ZONE \'Europe/Paris\') - INTERVAL \'30 second\'', [channel]).then(function (rows) {
                client.end();
                if (rows && rows.rows && rows.rows[0]) {
                    let message = rows.rows[0].title;

                    if (rows.rows[0].url.indexOf('youtu.be') !== -1) {
                        message += ' ( ' + rows.rows[0].url + ' )';
                    }

                    return resolve(message)
                } else {
                    return resolve('Je n\'ai pas la musique :(');
                }
            }).catch(reject);
        });
    });
};