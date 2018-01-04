const config = require('config');
const request = require('request');

module.exports.getMessage = function (location) {
    console.log(location);
    if(typeof location === 'undefined') {
        return resolve('Il me faut une location :) ');
    }
    return new Promise((resolve, reject) => {
        request({url: 'https://api.openweathermap.org/data/2.5/weather?lang=fr&units=metric&q=' + location + '&appid=' + config.get('openweather.key'), json: true}, function(error, response, body) {
            if(error) {
                return reject(error);
            }
            if(body.cod == 400 || body.cod == 404) {
                return resolve(body.message);
            }

            resolve(body.weather[0].description + ', ' + body.main.temp + ' degré(s)');
        });
    });
};