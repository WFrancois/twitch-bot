const config = require('config');
const request = require('request');

const Blizzard = require('blizzard.js');

const NBR_MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;

let savedAccessToken = null;

// See https://github.com/benweier/blizzard.js/blob/master/API.md for details about available API requests
module.exports.api = Blizzard.initialize({ apikey: config.get('blizzard.oauth.client_id') });

module.exports.getAccessToken = function() {
    return new Promise((resolve, reject) => {

        const now = new Date();
        if (savedAccessToken && savedAccessToken.token && savedAccessToken.expireDate && savedAccessToken.expireDate > now) {
            // If saved token is not expired, return it without asking a new one.
            return resolve(savedAccessToken.token);
        }

        request.post({
            url: config.get('blizzard.oauth.token_url'),
            form: {
                client_id: config.get('blizzard.oauth.client_id'),
                client_secret: config.get('blizzard.oauth.client_secret'),
                grant_type: config.get('blizzard.oauth.grant_type'),
            },
            json: true
        }, function (error, response, body) {
            if (error) {
                return reject(error);
            }

            if (response.statusCode != 200) {
                return reject(body);
            }

            // Blizzard oauth token endpoint return someting like this :
            // {"access_token":"xxxxxxxxxxxxxxxx","token_type":"bearer","expires_in":2591920}
            savedAccessToken = {
                token: body.access_token,
                expireDate: new Date(Date.now() + NBR_MILLISECONDS_IN_ONE_DAY), // keep access_token only for 24h
            }

            resolve(body.access_token);
        });
    });
};