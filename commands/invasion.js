let moment = require('moment');

let placeholder = {
    inProgress: 'L\'incursion est en cours pendant %hours% heures et %minutes% minutes',
    next: 'Prochaine incursion dans %hours% heures et %minutes% minutes'
};

let timestampDefault = 1544648400;
let timeInterval = (12 + 7) * 60 * 60;
let durationInvasion = 7 * 60 * 60;

module.exports.getMessage = function () {
    let currentTime = parseInt((new Date()).getTime() / 1000);

    let progress = ((currentTime - timestampDefault) % timeInterval);

    let textToUse;
    let duration;

    if (progress < durationInvasion) {
        duration = moment.duration(durationInvasion - progress, 'seconds');
        textToUse = placeholder.inProgress;
    } else {
        duration = moment.duration(timeInterval - progress, 'seconds');
        textToUse = placeholder.next;
    }

    let finalText = textToUse.replace('%hours%', duration.hours()).replace('%minutes%', duration.minutes()).replace('%seconds%', duration.seconds());

    // finalText += ' - https://invasion.wisak.me';

    return Promise.resolve(finalText);
};
