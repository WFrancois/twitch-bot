const config = require('config');

module.exports.invasion = require('./invasion');
module.exports.music = require('./music');
module.exports.bet = require('./bet');
module.exports.weather = require('./weather');
module.exports.emissary = require('./emissary');
module.exports.ilvl = require('./ilvl');
module.exports.warcraftlogs = require('./warcraftlogs');

module.exports.parseInput = function (message, username) {
    username = typeof username !== 'undefined' ? username : null;
    message = message.split(' ');
    let res = {};

    res.command = message[0].toLowerCase();
    if (message[1] && message[1].indexOf('!') === -1 && message[1].indexOf('/')) {
        res.target = message[1];
    } else {
        res.target = username;
    }

    return res;
};

let dontSpam = {};

module.exports.serviceCommand = class Command {
    constructor(channel, username) {
        this.channel = channel;
        this.username = username;

        this.allowedCommand = {
          '#kusa': ['music'],
          "#lapi": ['music', 'weather', 'emissary', 'incursion', 'try'],
        };
    }

    useCommand(name) {
        if (!dontSpam[this.channel]) {
            dontSpam[this.channel] = {};
        }

        dontSpam[this.channel][name] = Math.floor((new Date()).getTime() / 1000);
    }

    canUseCommand(name, seconds = 30, ignoreSuperUser = false) {
        if (!this.allowedCommand[this.channel] || this.allowedCommand[this.channel].indexOf(name) === -1) {
            return false;
        }

        if (!ignoreSuperUser && config.has('super_users') && config.get('super_users').indexOf(this.username) !== -1) {
            return true;
        }

        if (!dontSpam[this.channel]) {
            return true;
        }

        if (!dontSpam[this.channel][name]) {
            return true;
        }

        return Math.floor((new Date()).getTime() / 1000) - dontSpam[this.channel][name] > seconds;
    }
};
