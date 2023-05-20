const request = require('request');

const uuidMelody = {
    kusa: 'ab36ba29-3b36-48e4-9536-b64c711496a5',
    lapi: 'dcbeaa1f-3ee6-459e-a890-2fedd9f0275e',
    maystine: 'acddbba4-3122-46da-9aad-6ee53d393c2d',
    batsii__: '9fe1878b-5d18-426d-b5a5-5dad9f76575b',
};

module.exports.getMessage = async function (channel) {
    return new Promise((resolve, reject) => {
        request({url: `https://api.mymelody.live/bot-control/message/${uuidMelody[channel]}`}, function(error, response, body) {
            console.log(error, response, body);
            if(error) {
                return reject(error);
            }
            if(response.statusCode == 400 || response.statusCode == 404) {
                return reject('Fail 400/404');
            }

            if(response.statusCode != 200) {
                return reject('Fail !=200');
            }

            resolve(body);
        });
    })
};
