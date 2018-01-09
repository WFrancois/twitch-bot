module.exports.invasion = require('./invasion');
module.exports.music = require('./music');
module.exports.bet = require('./bet');
module.exports.weather = require('./weather');
module.exports.emissary = require('./emissary');

module.exports.parseInput = function (message, username) {
    username = typeof username !== 'undefined' ? username : null;
    message = message.split(' ');
    let res = {};

    res.command = message[0].toLowerCase();
    if (message[1]) {
        res.target = message[1];
    } else {
        res.target = username;
    }

    return res;
};

let dontSpam = {};

module.exports.serviceCommand = class Command {
    constructor(channel) {
        this.channel = channel;
    }

    useCommand(name) {
        if(!dontSpam[this.channel]) {
            dontSpam[this.channel] = {};
        }

        dontSpam[this.channel][name] = Math.floor((new Date()).getTime() / 1000);
    }

    canUseCommand(name, seconds = 30) {
        if(!dontSpam[this.channel]) {
            return true;
        }

        if(!dontSpam[this.channel][name]) {
            return true;
        }

        return Math.floor((new Date()).getTime() / 1000) - dontSpam[this.channel][name] > seconds;
    }
};