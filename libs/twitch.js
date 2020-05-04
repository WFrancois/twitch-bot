const config = require('config');
const request = require('request');

module.exports.isOnline = async function(channelName) {
    const accessToken = await getAppToken();

    const {body} = await tempRequestAsync({
        url: 'https://api.twitch.tv/helix/streams?user_login=' + channelName,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-ID': config.get('twitch.client_id'),
        },
        json: true
    });

    return !!body.data[0];
};

const getAppToken = async function () {
    const {body} = await tempRequestAsync({
        url: 'https://id.twitch.tv/oauth2/token',
        method: 'POST',
        qs: {
            client_id: config.get('twitch.client_id'),
            client_secret: config.get('twitch.client_secret'),
            grant_type: 'client_credentials',
        },
        json: true
    });

    return body.access_token;
};

function tempRequestAsync (requestConfig) {
    return new Promise(((resolve, reject) => {
        request(requestConfig, (error, response, body) => {
            if (error) {
                reject(error);
            }

            resolve({response, body});
        })
    }))
}
