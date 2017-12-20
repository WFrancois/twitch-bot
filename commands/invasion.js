let moment = require('moment');

let placeholder = {
    inProgress: 'L\'invasion est en cours pendant %hours% heures et %minutes% minutes',
    next: 'Prochaine invasion dans %hours% heures et %minutes% minutes'
};

let timestampDefault = 1491775200;
let timeInterval = 66600;
let durationInvasion = 6 * 60 * 60;

module.exports.getMessage = function() {
    let currentTime = parseInt((new Date()).getTime() / 1000);

    let progress = ((currentTime - timestampDefault) % timeInterval);

    let textToUse = '';
    let duration;
    if(progress < durationInvasion) {
        duration = moment.duration(durationInvasion - progress, 'seconds');
        textToUse = placeholder.inProgress;
    } else {
        duration = moment.duration(timeInterval - progress, 'seconds');
        textToUse = placeholder.next;
    }

    return Promise.resolve(textToUse.replace('%hours%', duration.hours()).replace('%minutes%', duration.minutes()).replace('%seconds%', duration.seconds()));
};