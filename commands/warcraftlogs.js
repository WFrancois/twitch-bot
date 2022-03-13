const config = require('config');
const request = require('request');

module.exports.getMessage = function () {
    return new Promise((resolve, reject) => {
        const url = `https://raider.io/api/v1/live-tracking/bossprogress?raid=sepulcher-of-the-first-ones&difficulty=mythic&region=eu&realm=archimonde&guild=Impact&boss=latest`;

        request(url, (error, response, body) => {
            if (error) {
                reject(error);
            }

            const bossProgress = JSON.parse(body);

            const raidProgressUrl = `https://raider.io/api/v1/raiding/raid-rankings?raid=sepulcher-of-the-first-ones&difficulty=mythic&region=eu&realm=archimonde&guilds=861322`;

            request(raidProgressUrl, (rError, rResponse, rBody) => {
                const raidProgress = JSON.parse(rBody);

                const bossKilled = raidProgress.raidRankings[0].encountersDefeated.length;

                const percentMessage = bossProgress.isDefeated ? 'killed!' : `best pull: ${bossProgress.bestPercent}%,`

                return resolve(`[Progress Sepulcher: ${bossKilled}/11] Actuellement sur ${bossProgress.boss.name} : ${percentMessage} ${bossProgress.pullCount} ${bossProgress.pullCount > 1 ? 'pulls' : 'pull'}. Powered by Raider.IO`);
            });
        })
    });
};
