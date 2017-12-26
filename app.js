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

    // Elena spam
    let regexTriggerElena = /elena[0-9]*/gi;
    if (regexTriggerElena.exec(userstate['username'])) {
        setTimeout(function () {
            client.ban(channel, userstate['username'], 'Spam, whisp Isak59 si erreur')
        }, 1000);
    }

    commandTwitch.bet.run(client, channel, userstate, message);

    switch (command.command) {
        case '!invasion':
        case '!assaut':
            if (!commandTwitch.canCommand('invasion')) {
                break;
            }
            commandTwitch.updateSpam('invasion');

            commandTwitch.invasion.getMessage().then(function (messageToSend) {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            });
            break;
        case '!music':
        case '!musique':
            if (!commandTwitch.canCommand('music')) {
                break;
            }
            commandTwitch.updateSpam('music');

            commandTwitch.music.getMessage().then(function (messageToSend) {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
        case '!updatetry':
            if(userstate.mod) {
                client.say(channel, '!editcom !try $(touser) > Best try Argus MM: P3 ' + command.target + '%');
            }
            break;
    }
});

client.on("disconnected", function (reason) {
    console.warn('Just got disconnect :(', reason);
});