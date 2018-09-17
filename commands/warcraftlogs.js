const config = require('config');
const request = require('request');

const MAP_DIFFICULTY = {
    3: {
        shortName: 'NM',
        name: 'Normal',
    },
    4: {
        shortName: 'HM',
        name: 'Heroic',
    },
    5: {
        shortName: 'MM',
        name: 'Mythic',
    }
};

const bossIds = [2136, 2134, 2145, 2135, 2122];

let cacheWarcraftLogs = [];

module.exports.getMessage = async function () {
    const reportCodes = config.get('wlog.report_code');

    let fetchPull = [];

    for (const reportCode of reportCodes) {
        fetchPull.push(getDataWarcraftLogs(reportCode));
    }

    const reportData = await Promise.all(fetchPull);

    const bossesInfo = mergeReportData(reportData);

    let orderedBossInfo = [];

    for (const bossId of bossIds) {
        if( bossesInfo[bossId]) {
            orderedBossInfo.push(bossesInfo[bossId]);
        }
    }

    const messageSplitted = [];
    for (const bossInfo of orderedBossInfo) {
        let message = bossInfo.name + ': ' + bossInfo.pull;
        if (bossInfo.killed) {
            message += ' pull';

            // Only display kills from the last two days
            if ((new Date().getTime()) - (bossInfo.killedTime) > 48 * 60 * 60 * 1000) {
                continue;
            }
        } else {
            message += ' try';

            const minPercent = Math.min(...bossInfo.percents) / 100;
            const lastTry = bossInfo.percents[bossInfo.percents.length - 1] / 100;

            message += ` (Best try: ${minPercent}%, Last try: ${lastTry}%)`;
        }

        messageSplitted.push(message);
    }

    return messageSplitted.join(' / ');
};

function getDataWarcraftLogs(reportCode) {
    return new Promise((resolve, reject) => {
        if (cacheWarcraftLogs[reportCode]) {
            return resolve(cacheWarcraftLogs[reportCode]);
        }

        const url = `https://www.warcraftlogs.com/v1/report/fights/${reportCode}?api_key=${config.get('wlog.api_key')}`;

        request(url, (error, response, body) => {
            if (error) {
                reject(error);
            }

            let bossesInfo = [];

            body = JSON.parse(body);

            for (const fight of body.fights) {
                if (!fight.boss || fight.affixes || bossIds.indexOf(fight.boss) === -1 || fight.difficulty !== 5) {
                    continue;
                }

                const fightDuration = fight.end_time - fight.start_time;

                if (fightDuration / 1000 < 10) {
                    continue;
                }

                const fightName = `${fight.name} (${MAP_DIFFICULTY[fight.difficulty].shortName})`;

                if (!bossesInfo[fight.name]) {
                    bossesInfo[fight.name] = {boss: fight.boss, killed: false, pull: 0, name: fightName, percents: []};
                }

                bossesInfo[fight.name].pull += 1;
                bossesInfo[fight.name].percents.push(fight.fightPercentage);

                if (fight.kill) {
                    bossesInfo[fight.name].killed = true;
                    bossesInfo[fight.name].killedTime = body.start + fight.start_time;
                }
            }

            if ((new Date()).getTime() - body.end > 12 * 60 * 60 * 1000) {
                cacheWarcraftLogs[reportCode] = bossesInfo;
            }

            return resolve(bossesInfo);
        })
    });
}

function mergeReportData (reportData) {
    const bossInfo = {};

    for (const reportDatum of reportData) {
        for (let key in reportDatum) {
            if (!reportDatum.hasOwnProperty(key)) continue;

            const fight = reportDatum[key];

            if (!bossInfo[fight.boss]) {
                bossInfo[fight.boss] = {
                    boss: fight.boss,
                    killed: false,
                    pull: 0,
                    name: fight.name,
                    percents: []
                }
            }

            bossInfo[fight.boss].pull += fight.pull;
            bossInfo[fight.boss].percents.push(...fight.percents);

            if (fight.killed) {
                bossInfo[fight.boss].killed = true;
                bossInfo[fight.boss].killedTime = fight.killedTime;
            }
        }
    }

    return bossInfo;
}