const config = require('config');
const request = require('request');
const cheerio = require('cheerio');
const blizzard = require('../libs/blizzard');

module.exports.getMessage = function (location) {
    return new Promise((resolve, reject) => {
        blizzard.api.wow.character(['profile', 'items'], {
            origin: 'eu',
            realm: 'ysondre',
            name: 'lapintade'
        }).then(response => {
            resolve('Ilvl de Lapi équipé : ' + response.data.items.averageItemLevelEquipped + ' (en sac : ' + response.data.items.averageItemLevel + ')');
        }).catch(reject);
    });
};