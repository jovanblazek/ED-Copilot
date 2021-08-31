# Discord bot for Elite Dangerous
Made specifically for our player faction, although it is possible to change links and ids in `config.json` to make it work with yours.

## Features

#### General:

- Check if there was tick today
- Get influence and states of factions in chosen system
- Get nearest Tech Brokers, Material Traders or Interstellar factors from chosen system
- Calculate distance between two systems
- Report to chosen channel when tick happens. (requires manual config)

#### Faction specific:

- Get report of all systems where the faction is present (influence and gain/loss since last tick)
- Get active conflicts and their details
- Get all stations currently under control of your faction

INARA links provided where possible.

## Usage

Default prefix: `?`

List of commands: `?help`

## Setup

1. Clone repo
2. Run `npm install`
3. Get your faction information from `https://elitebgs.app/api/ebgs/v5/factions?name=FACTION%20NAME`.
4. Copy `_id` to `factionId` in `config.js`
5. Copy `eddb_id` to `eddbid` in `config.js`
6. Replace `inaraFactionUrl` in `config.js` with url to your faction
7. Replace `tickReportChannel` with id of your discord channel, where you want to get messages when there was a tick.
8. Create `.env` file and write `BOT_TOKEN=`, then paste here your discord bot token
9. Run `node index.js` to start the bot

## Contributing

Make issues or contact me directly.

> I plan to make this bot less specific and more configurable so it can be easily used by anyone.

## License

>You can check out the full license [here](https://github.com/jovanblazek/elitehub-bot/blob/main/LICENSE.md)

This project is licensed under the terms of the **MIT** license.

---

Spaghetti code, please don't judge. 🙏
Made with 💗 in free time.
