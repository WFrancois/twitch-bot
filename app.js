let tmi = require('twitch-js');
let config = require('config');
let commandTwitch = require('./commands');

let options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: config.get('tmi.username'),
        password: config.get('tmi.password')
    },
    channels: config.get('channels')
};

let client = new tmi.client(options);
client.connect();

client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    let command = commandTwitch.parseInput(message, userstate['display-name']);

    switch(command.command) {
        case '!invasion':
        case '!assaut':
            if(!commandTwitch.canCommand('invasion')) {
                break;
            }
            commandTwitch.updateSpam('invasion');
            let message = commandTwitch.invasion.getMessage();
            message = command.target + ' > ' + message;
            client.say(channel, message);
            break;
    }
});