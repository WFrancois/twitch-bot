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

    // Ban bot spam
    let regexes = [/elena[0-9]*/gi, /^kcanno/gi];
    for(let regex of regexes) {
        if(regex.exec(userstate['username'])) {
            setTimeout(() => client.ban(channel, userstate.username, 'Spam, whisp Isak_ si erreur'), 1000);
        }
    }

    if(message.indexOf('tonton1') !== -1 && message.indexOf('tonton2') !== -1) {
        client.say(channel, 'nop lapiOMG lapiRIP Kappa');
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
            if (!commandTwitch.canCommand('music', 15)) {
                break;
            }
            commandTwitch.updateSpam('music');

            commandTwitch.music.getMessage().then(function (messageToSend) {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
        case '!météo':
        case '!meteo':
        case '!méteo':
        case '!metéo':
            if (!commandTwitch.canCommand('weather')) {
                break;
            }
            commandTwitch.updateSpam('weather');

            commandTwitch.weather.getMessage(message.slice(7)).then(function (messageToSend) {
                messageToSend = userstate['display-name'] + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
        case '!wq':
        case '!worldquest':
        case '!emissaire':
        case '!emissary':
        if (!commandTwitch.canCommand('emissary')) {
            break;
        }
        commandTwitch.updateSpam('emissary');
        commandTwitch.emissary.getMessage().then(function (messageToSend) {
            messageToSend = command.target + ' > ' + messageToSend;
            client.say(channel, messageToSend);
        }).catch(console.warn);
        break;
    }
});

client.on("disconnected", function (reason) {
    console.warn('Just got disconnect :(', reason);
});
