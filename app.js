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

    let serviceCommand = new commandTwitch.serviceCommand(channel, userstate.username);
    let command = commandTwitch.parseInput(message, userstate['display-name']);

    switch (command.command) {
        case '!invasion':
        case '!assaut':
            if (!serviceCommand.canUseCommand('invasion')) {
                break;
            }
            serviceCommand.useCommand('invasion');

            commandTwitch.invasion.getMessage().then(function (messageToSend) {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            });
            break;
        case '!music':
        case '!musique':
            if (!serviceCommand.canUseCommand('music', 15)) {
                break;
            }
            serviceCommand.useCommand('music');

            commandTwitch.music.getMessage(channel.substr(1)).then(function (messageToSend) {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
        case '!météo':
        case '!meteo':
        case '!méteo':
        case '!metéo':
            if (!serviceCommand.canUseCommand('weather')) {
                break;
            }
            serviceCommand.useCommand('weather');

            commandTwitch.weather.getMessage(message.slice(7)).then(function (messageToSend) {
                messageToSend = userstate['display-name'] + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
        case '!wq':
        case '!worldquest':
        case '!emissaire':
        case '!emissary':
            if (!serviceCommand.canUseCommand('emissary')) {
                break;
            }
            serviceCommand.useCommand('emissary');

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
