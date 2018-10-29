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

let messageNumber = 10;
client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Ban bot spam
    // let regexes = [/elena[0-9]*/gi, /^kcanno/gi];
    // for(let regex of regexes) {
    //     if(regex.exec(userstate['username'])) {
    //         setTimeout(() => client.ban(channel, userstate.username, 'Spam, whisp Isak_ si erreur'), 1000);
    //     }
    // }

    commandTwitch.bet.run(client, channel, userstate, message);

    let serviceCommand = new commandTwitch.serviceCommand(channel, userstate.username);
    let command = commandTwitch.parseInput(message, userstate['display-name']);

    // messageNumber ++;
    // if(serviceCommand.canUseCommand('see-gear', 600, true) && messageNumber > 10) {
    //     serviceCommand.useCommand('see-gear');
    //     messageNumber = 0;
    //
    //     message = 'Vous pouvez voir le stuff actuel des joueurs  grâce à l\'extension Twitch ! Passez votre souris sur le stream et cliquez sur "Inspect" (en haut à gauche) lapiBLESS';
    //     client.say(channel, message);
    // }

    switch (command.command) {
        case '!caster':
        case '!casters':
            if(!serviceCommand.canUseCommand('caster')) {
                break;
            }
            serviceCommand.useCommand('caster');

            let casters = ['Lapi https://twitch.tv/w_lapin', 'Kusaa https://twitch.tv/kusaaa', 'Tonton https://twitch.tv/krakantas'];

            casters = shuffle(casters);

            message = command.target + ' > Casters français: ' + casters.join(' , ');
            client.say(channel, message);
            break;
        case '!stuff':
        case '!gear':
        case '!inspect':
        case '!extension':
            if(!serviceCommand.canUseCommand('stuff')) {
                break;
            }
            serviceCommand.useCommand('stuff');
            message = command.target + ' > Tu peux voir le stuff actuel des joueurs grâce à l\'extension Twitch ! Passe ta souris sur le stream et clique sur "Inspect" (en haut à gauche) lapiBLESS';
            client.say(channel, message);
            break;
        case '!bracket':
            if(!serviceCommand.canUseCommand('bracket')) {
                break;
            }
            serviceCommand.useCommand('bracket');

            message = command.target + ' > ' + 'Vous pouvez retrouver le bracket Europe sur https://liquipedia.net/worldofwarcraft/Arena_World_Championship/2018';
            client.say(channel, message);
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
        case '!ilvl':
            if (!serviceCommand.canUseCommand('ilvl')) {
                break;
            }
            serviceCommand.useCommand('ilvl');

            commandTwitch.ilvl.getMessage('Lapintade', 'Ysondre', 'Druide').then(messageToSend => {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
        case '!ilvldk':
            if (!serviceCommand.canUseCommand('ilvldk')) {
                break;
            }
            serviceCommand.useCommand('ilvldk');

            commandTwitch.ilvl.getMessage('Lapikaglace', 'Ysondre', 'DK').then(messageToSend => {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
        case '!ilvlsham':
            if (!serviceCommand.canUseCommand('ilvlsham')) {
                break;
            }
            serviceCommand.useCommand('ilvlsham');

            commandTwitch.ilvl.getMessage('Lapiñacolada', 'Sargeras', 'Shaman').then(messageToSend => {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
        case '!try':
        case '!besttry':
            if (!serviceCommand.canUseCommand('try')) {
                break;
            }
            serviceCommand.useCommand('try');

            commandTwitch.warcraftlogs.getMessage().then(messageToSend => {
                messageToSend = command.target + ' > ' + messageToSend;
                client.say(channel, messageToSend);
            }).catch(console.warn);
            break;
    }
});

client.on("disconnected", function (reason) {
    console.warn('Just got disconnect :(', reason);
});

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
