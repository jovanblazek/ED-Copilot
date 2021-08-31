# Discord bot for Elite Dangerous
Made specifically for our player faction, although it is possible to change faction name in `config.json` to make it work with yours.

## Features

#### General:

- Check if there was tick today (UTC +1)
- Get influence and states of factions in chosen system
- Get nearest Tech Brokers, Material Traders or Interstellar factors
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
3. Replace `factionName` value in `config.js` with your faction name
4. Replace `tickReportChannel` value with id of your discord text channel, where you want to get messages when tick happens.
5. Rename `.env.example` to `.env`, then paste here your discord bot token
6. Run `node index.js` to start the bot

(Optional) Translate text to your language

## Changing the commands

To change the command name, rename `name` property in the command file.


## Contributing

Feel free to make issues/feature requests or contact me directly.

> I plan to make this bot less specific and more configurable so it can be easily used by anyone. This goes for translations as well

## License

This project is licensed under the terms of the **MIT** license.

>You can check out the full license [here](https://github.com/jovanblazek/elitehub-bot/blob/main/LICENSE.md)

---

Spaghetti code, please don't judge. 🙏
Made with 💗 in free time.
