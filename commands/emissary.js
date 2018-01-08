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
            let formatedMsg = 'Emissaires actifs aujourd\'hui : %s, %s et %s';
            
            for (let i = 1; i <= 5; i += 2) {
                emissaryArray.push($('#world-quests-header > div:nth-child(1) > dl > dt:nth-child(' + i + ') > a').text())
            }
            
            let j = 0;
            while (formatedMsg.indexOf('%s') > -1 && j < emissaryArray.length) {
              formatedMsg = formatedMsg.replace('%s', emissaryArray[j])
              j += 1;
            }        

            resolve(formatedMsg);
        });
    });
};