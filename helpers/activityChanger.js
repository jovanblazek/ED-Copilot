const { prefix } = require("../config.json");

const activities = [
    'Waiting for tick ⏱',
    'Reading elitehub.eu 📕',
    'Exploring the galaxy 🚀',
    'Enjoying Lavian Brandy 🍸',
    'Mining Painite ⛏',
    'That is a big haul 👀',
    'Top 1% of all bots!',
    'Simping for Aisling 😍'
]

function getRandomActivity() {
    const randomIndex = Math.floor(Math.random() * (activities.length));
    const newActivity = activities[randomIndex];

    return {
        status: "online",
        activity: {
            name: `${newActivity} ${prefix}help`,
            type: "PLAYING",
        },
    }
}

module.exports = { getRandomActivity };
