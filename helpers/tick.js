const got = require("got");
const moment = require("moment");
const momenttz = require("moment-timezone");
moment.locale("sk");

function wasAfterTick(lastUpdate, tickTime) {
    const tickTimeLocal = tickTime.tz("Europe/Berlin")

    let difference = ((lastUpdate - tickTimeLocal)/1000)/60
    if(difference > 0)
        return true;

    return false;
}

async function getTickTime() {
    try {
        const timeToday = Math.floor(new Date().getTime() / 1000.0);
        let timeYesterday = new Date();
        timeYesterday.setDate(timeYesterday.getDate() - 2);
        timeYesterday = Math.floor(timeYesterday.getTime() / 1000.0);

        const url = `https://elitebgs.app/api/ebgs/v5/ticks?timeMin=${timeYesterday}000&timeMax=${timeToday}000`;
        const fetchedData = await got(url).json();
        if (JSON.stringify(fetchedData) === "[]") return null;

        return (date = moment.utc(fetchedData[0].time));
    } catch (error) {
        console.log(error);
    }
}

module.exports = { wasAfterTick, getTickTime };
