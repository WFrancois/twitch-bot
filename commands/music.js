const request = require('request');

const uuidMelody = {
    kusa: 'ab36ba29-3b36-48e4-9536-b64c711496a5',
    lapi: 'dcbeaa1f-3ee6-459e-a890-2fedd9f0275e',
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
