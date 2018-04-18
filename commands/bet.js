const config = require('config');
const {Client} = require('pg');
const commandTwitch = require('./index');

const clientDb = new Client(config.get('db.bet'));
clientDb.connect();

let answerTypes = {};

clientDb.query('SELECT * FROM answertype').then(data => {
    for (let row of data.rows) {
        answerTypes[row.id] = row;
    }
}).catch(console.warn);

let messageBetAlreadySent = {};

module.exports.run = function(client, channel, userstate, message) {
    clientDb.query("SELECT *, (EXTRACT(EPOCH FROM current_timestamp - datecreated))::Integer AS \"time_created\" FROM bet ORDER BY datecreated DESC LIMIT 1").then(data => {
        if(!(data && data.rows && data.rows.length)) {
            return;
        }

        const row = data.rows[0];

        const timeCreated = row.time_created;
        const duration = row.paridurationminute * 60;
        const timeLeft = duration - timeCreated;

        if (timeLeft <= 0) {
            return;
        }

        let timeBetweenMessageSend = 300000;
        if(timeLeft < 60 * 5) {
            timeBetweenMessageSend = 60000;
        }

        if (!messageBetAlreadySent[row.id] || (messageBetAlreadySent[row.id] + timeBetweenMessageSend) < (new Date()).getTime()) {
            messageBetAlreadySent[row.id] = (new Date()).getTime();

            let messageToSend = row.name;

            let displayLeft = '';
            if(timeLeft < 60) {
                displayLeft = timeLeft + ' seconde(s)';
            } else {
                displayLeft = Math.floor(timeLeft / 60) + ' minute(s)';
            }

            if(row.answertypeid === 6) {
                messageToSend += ' | Pendant ' + displayLeft + '.';
            } else {
                messageToSend += ' | Pendant ' + displayLeft + '. Faites "!vote" pour voter !';
                messageToSend += ' (Par exemple : !vote ' + answerTypes[row.answertypeid].placeholder + ')';
            }

            client.say(channel, messageToSend);
        }

        let command = commandTwitch.parseInput(message, userstate['username']);

        if (row.answertypeid !== 6 && command.command === '!vote') {
            clientDb.query('SELECT * FROM vote WHERE betid = $1 AND username = $2', [row.id, userstate['username']]).then((dataVote) => {
                if(dataVote.rows.length) {
                    clientDb.query('UPDATE vote SET answer = $1 WHERE id = $2', [message.slice(6), dataVote.rows[0].id]).then(() => {});
                } else {
                    clientDb.query('INSERT INTO vote(betid, username, answer) VALUES($1, $2, $3)', [row.id, userstate.username, message.slice(6)]).then(() => {});
                }
            });
        }

        if(row.answertypeid === 6) {
            let answer = /^([1-2])\s*/.exec(message);

            if(!answer) {
                return;
            }

            answer = row.parameter['team-' + answer[1]];

            clientDb.query('SELECT * FROM vote WHERE betid = $1 AND username = $2', [row.id, userstate['username']]).then((dataVote) => {
                if(dataVote.rows.length) {
                    clientDb.query('UPDATE vote SET answer = $1 WHERE id = $2', [answer, dataVote.rows[0].id]).then(() => {});
                } else {
                    clientDb.query('INSERT INTO vote(betid, username, answer) VALUES($1, $2, $3)', [row.id, userstate.username, answer]).then(() => {});
                }
            });
        }
    });
};