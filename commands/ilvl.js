const config = require('config');
const request = require('request');
const cheerio = require('cheerio');
const blizzard = require('../libs/blizzard');

module.exports.getMessage = function (name, realmName, wowClass) {
    return new Promise((resolve, reject) => {
        blizzard.api.wow.character(['profile', 'items'], {
            origin: 'eu',
            realm: realmName,
            name: name
        }).then(response => {
            resolve('Ilvl de Lapi (' + wowClass + ') équipé : ' + response.data.items.averageItemLevelEquipped + ' (en sac : ' + response.data.items.averageItemLevel + ') ; Azerite Level : ' + response.data.items.neck.azeriteItem.azeriteLevel);
        }).catch(reject);
    });
};