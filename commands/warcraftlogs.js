const config = require('config');
const request = require('request');

module.exports.getMessage = function () {
    return new Promise((resolve, reject) => {
        const url = `https://raider.io/api/v1/live-tracking/bossprogress?raid=vault-of-the-incarnates&difficulty=heroic&region=eu&realm=ysondre&guild=J%20J%20J%20J%20J%20J%20J%20J%20J%20J%20J%20J&boss=latest`;

        request(url, (error, response, body) => {
            if (error) {
                reject(error);
            }

            const bossProgress = JSON.parse(body);

            const raidProgressUrl = `https://raider.io/api/v1/raiding/raid-rankings?raid=vault-of-the-incarnates&difficulty=heroic&region=eu&realm=archimonde&guilds=1839426`;

            request(raidProgressUrl, (rError, rResponse, rBody) => {
                const raidProgress = JSON.parse(rBody);

                const bossKilled = raidProgress.raidRankings[0] ? raidProgress.raidRankings[0].encountersDefeated.length : 0

                const percentMessage = bossProgress.isDefeated ? 'killed!' : `best pull: ${bossProgress.bestPercent}%,`

                return resolve(`[Progress Vault: ${bossKilled}/8] Actuellement sur ${bossProgress.boss.name} : ${percentMessage} ${bossProgress.pullCount} ${bossProgress.pullCount > 1 ? 'pulls' : 'pull'}. Powered by Raider.IO`);
            });
        })
    });
};
