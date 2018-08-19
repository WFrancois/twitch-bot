const request = require('request');
const cheerio = require('cheerio');

module.exports.getMessage = function (location) {
    return new Promise((resolve, reject) => {
        request('http://fr.wowhead.com/world-quests/eu', function(error, response, body) {
            if(error || response.statusCode != 200) {
                console.log('rejected error')
                return reject(error);
            }
            
            const $ = cheerio.load(body);
            
            const emissaryArray = [];
            let formatedMsg = 'Emissaires actifs aujourd\'hui : ';

            const emissaryList = $('#world-quests-header').find('> div:nth-child(1) > dl');

            emissaryList.find('dt').each((a, item) => {
                emissaryArray.push($(item).find('a').text());
            });

            formatedMsg += emissaryArray.join(', ');

            resolve(formatedMsg);
        });
    });
};