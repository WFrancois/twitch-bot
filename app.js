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

    // commandTwitch.bet.run(client, channel, userstate, message);

    let serviceCommand = new commandTwitch.serviceCommand(channel, userstate.username);
    let command = commandTwitch.parseInput(message, userstate['display-name']);

    if(serviceCommand.canUseCommand('see-gear', 600, true) && messageNumber > 10) {
        serviceCommand.useCommand('see-gear');
        messageNumber ++;

        message = 'Vous pouvez voir le stuff actuel des joueurs  grâce à l\'extension Twitch ! Passez votre souris sur le stream et cliquez sur "Inspect" lapiBLESS';
        client.say(channel, message);
    }

    switch (command.command) {
        case '!stuff':
        case '!gear':
        case '!inspect':
        case '!extension':
            if(!serviceCommand.canUseCommand('stuff')) {
                break;
            }
            serviceCommand.useCommand('stuff');
            message = command.target + ' > Tu peux voir le stuff actuel des joueurs grâce à l\'extension Twitch ! Passe ta souris sur le stream et clique sur "Inspect" lapiBLESS';
            client.say(channel, message);
            break;
        case '!bracket':
            if(!serviceCommand.canUseCommand('bracket')) {
                break;
            }
            serviceCommand.useCommand('bracket');

            message = command.target + ' > ' + 'Vous pouvez retrouver le bracket Europe sur http://bit.ly/mdi_europe';
            client.say(channel, message);
            break;
        case '!mdi':
            if(!serviceCommand.canUseCommand('mdi')) {
                break;
            }

            serviceCommand.useCommand('mdi');

            message = command.target + ' > Toutes les infos sur le Mythic Dungeon Invitational (MDI) ici: https://worldofwarcraft.com/fr-fr/esports/mythic';
            client.say(channel, message);
            break;
        // case '!invasion':
        // case '!assaut':
        //     if (!serviceCommand.canUseCommand('invasion')) {
        //         break;
        //     }
        //     serviceCommand.useCommand('invasion');
        //
        //     commandTwitch.invasion.getMessage().then(function (messageToSend) {
        //         messageToSend = command.target + ' > ' + messageToSend;
        //         client.say(channel, messageToSend);
        //     });
        //     break;
        // case '!music':
        // case '!musique':
        //     if (!serviceCommand.canUseCommand('music', 15)) {
        //         break;
        //     }
        //     serviceCommand.useCommand('music');
        //
        //     commandTwitch.music.getMessage(channel.substr(1)).then(function (messageToSend) {
        //         messageToSend = command.target + ' > ' + messageToSend;
        //         client.say(channel, messageToSend);
        //     }).catch(console.warn);
        //     break;
        // case '!météo':
        // case '!meteo':
        // case '!méteo':
        // case '!metéo':
        //     if (!serviceCommand.canUseCommand('weather')) {
        //         break;
        //     }
        //     serviceCommand.useCommand('weather');
        //
        //     commandTwitch.weather.getMessage(message.slice(7)).then(function (messageToSend) {
        //         messageToSend = userstate['display-name'] + ' > ' + messageToSend;
        //         client.say(channel, messageToSend);
        //     }).catch(console.warn);
        //     break;
        // case '!wq':
        // case '!worldquest':
        // case '!emissaire':
        // case '!emissary':
        //     if (!serviceCommand.canUseCommand('emissary')) {
        //         break;
        //     }
        //     serviceCommand.useCommand('emissary');
        //
        //     commandTwitch.emissary.getMessage().then(function (messageToSend) {
        //         messageToSend = command.target + ' > ' + messageToSend;
        //         client.say(channel, messageToSend);
        //     }).catch(console.warn);
        //     break;
    }
});

client.on("disconnected", function (reason) {
    console.warn('Just got disconnect :(', reason);
});
