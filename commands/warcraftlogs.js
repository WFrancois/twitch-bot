const config = require('config');
const request = require('request');

const url =

module.exports.getMessage = function () {
    return new Promise((resolve, reject) => {
        const url = `https://www.warcraftlogs.com/v1/report/fights/${config.get('wlog.report_code')}?api_key=${config.get('wlog.api_key')}`;

        request(url, (error, response, body) => {
            if (error) {
                reject(error);
            }

            let bossesInfo = [];

            body = JSON.parse(body);

            for (const fight of body.fights) {
                if (!fight.boss) {
                    continue;
                }

                const fightDuration = fight.end_time - fight.start_time;

                if (fightDuration / 1000 < 10) {
                    continue;
                }

                if (!bossesInfo[fight.name]) {
                    bossesInfo[fight.name] = {killed: false, pull: 0, name: fight.name};
                }

                bossesInfo[fight.name].pull += 1;

                if (fight.kill) {
                    bossesInfo[fight.name].killed = true;
                }
            }

            const messageSplitted = [];
            for (let key in bossesInfo) {
                if (!bossesInfo.hasOwnProperty(key)) continue;

                let bossInfo = bossesInfo[key];

                let message = bossInfo.name + ': ' + bossInfo.pull;
                if (bossInfo.killed) {
                    message += ' pull';
                } else {
                    message += ' try';
                }

                messageSplitted.push(message);
            }

            return resolve(messageSplitted.join(' / '));
        })
    });
};