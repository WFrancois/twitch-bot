module.exports.invasion = require('./invasion');

module.exports.parseInput = function(message, username) {
    username = typeof username  !== 'undefined' ?  username  : null;
    message = message.split(' ');
    let res = {};

    res.command = message[0].toLowerCase();
    if(message[1]) {
        res.target = message[1];
    } else {
        res.target = username;
    }

    return res;
};

let dontSpam = {};

module.exports.updateSpam = function(name) {
    dontSpam[name] = parseInt((new Date()).getTime() / 1000);
};

module.exports.canCommand = function(name) {
    return !dontSpam[name] || parseInt((new Date()).getTime() / 1000) - dontSpam[name] > 30
};