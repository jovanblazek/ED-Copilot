import type { BaseTranslation } from '../i18n-types'

// eslint-disable-next-line @typescript-eslint/naming-convention
const en = {
  error: {
    unknown: 'Unknown error occurred 😞',
    general: 'Something went wrong. Try again later.',
    systemNotFound: 'Could not find system named `{systemName}`.',
    tickFetchError: 'Could not fetch tick data. \nCheck [this site](https://elitebgs.app/tick).',
    timeDifferenceError: 'Time difference error.',
    dataParseError: 'Could not parse data.',
    adminOnly: 'This command is only available to admins.',
    buttonsDisabled: "These buttons aren't for you!",
  },
  setup: {
    faction: {
      notFound: 'Could not find any factions with that name.',
      confirm: {
        title: 'Is this information correct?',
        description:
          'Name: {factionName}\nShorthand: {factionShorthand}\nAllegiance: {allegiance}\nSystems present: {systemsCount}.',
      },
      saved: 'Faction saved.',
      canceled: 'Faction setup canceled.',
    },
    profile: {
      saved: 'Profile settings saved.',
    },
    language: {
      saved: 'Language settings saved.',
    },
    timezone: {
      saved: 'Timezone settings saved.',
      canceled:
        'Timezone setup canceled. If you are having trouble setting up timezone, try to find your timezone on [this site](https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a).',
      notFound:
        'Could not find timezone with that name. Try to find your timezone on [this site](https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a).',
      confirm: {
        title: 'Is this information correct?',
        description: 'Current time: {currentTime}',
      },
    },
    tickReportChannel: {
      title: 'Current tick reporting channel',
      description: 'Channel: {channel}\n Are you sure you want to remove it?',
      descriptionNoChannel: 'Channel: -',
      saved: 'Channel {channel} will now be used for reporting game ticks.',
      removed: 'Tick reporting channel removed.',
      notRemoved: 'Channel {channel} will remain used for reporting game ticks.',
    },
  },
  faction: {
    notSetup: 'Faction is not setup.',
  },
  ping: {
    response: 'Pong',
  },
  techBroker: {
    title: 'Technology Brokers',
  },
  materialTrader: {
    title: 'Material Traders',
  },
  interstellarFactors: {
    title: 'Interstellar Factors',
  },
  tick: {
    title: 'Last TICK',
    wasToday: 'Today',
    history: 'Tick history',
  },
  systemInfo: {
    title: 'Factions in {systemName}',
    lastUpdate: 'Last update: {time}',
  },
  commanderProfile: {
    notFound:
      'Could not find commander profile.\nAdd your CMDR name and EDSM API key using `/setup profile` command.',
    missingEdsmKey:
      'To see account balance, you need to add your EDSM API key using `/setup profile` command.',
  },
} satisfies BaseTranslation

export default en
