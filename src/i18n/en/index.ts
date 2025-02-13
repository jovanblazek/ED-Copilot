import type { BaseTranslation } from '../i18n-types'

// eslint-disable-next-line @typescript-eslint/naming-convention
const en = {
  error: {
    unknown: 'Unknown error occurred 😞',
    general: 'Something went wrong. Try again later.',
    systemNotFound: 'Could not find system named `{systemName}`.',
    tickFetchError: 'Could not fetch tick data. \nCheck [this site](https://elitebgs.app/tick).',
    dataParseError: 'Could not parse data.',
    buttonsDisabled: "These buttons aren't for you!",
  },
  copilot: {
    faction: {
      notFound: 'Could not find any factions with that name.',
      confirm: {
        title: 'Is this information correct?',
        description:
          'Name: {factionName}\nShorthand: {factionShorthand}\nAllegiance: {allegiance}\nSystems present: {systemsCount}\nNotification channel: {notificationChannel}',
      },
      saved: 'Faction saved.',
      canceled: 'Faction setup canceled.',
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
    conflicts: {
      title: '{factionName} Conflicts',
      noConflicts: 'No conflicts 🎉',
      pendingConflict: 'Pending',
    },
    systems: {
      title: '{factionName} Systems',
    },
    stations: {
      title: '{factionName} Stations',
    },
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
  setup: {
    profile: {
      saved: 'Profile settings saved.',
    },
  },
  discordNotification: {
    conflict: {
      conflictType: {
        election: 'Election',
        civilWar: 'Civil War',
        war: 'War',
      },
      status: {
        pending: 'Pending',
        active: 'Active',
        ended: 'Ended',
      },
      title: '{emoji} {conflictType} {status} in {systemName} {emoji}',
      fields: {
        status: {
          title: 'Status',
        },
        oponent: {
          title: 'Oponent:',
        },
        yourStake: {
          title: '💥 Lost on Defeat',
        },
        opponentStake: {
          title: '🏆 Gained on Victory',
        },
      },
    },
    expansion: {
      title: {
        pending: '✈️ Expansion Pending ✈️',
        active: '✈️ Expansion Active ✈️',
        ended: '✈️ Expansion Ended ✈️',
      },
      description: {
        pending:
          'Pending expansion was detected in **{systemName}**.\nCheck the [INARA]({inaraUrl}) or in game for more information.\n\n*Due to technical limitations, it is not possible to determine the exact origin of the expansion at the time it was detected.*',
        active:
          'Active expansion was detected in **{systemName}**.\nCheck the [INARA]({inaraUrl}) or in game for more information.\n\n*Due to technical limitations, it is not possible to determine the exact origin of the expansion at the time it was detected.*',
        ended:
          'It is too early to determine where your faction expanded to.\nCheck the [INARA]({inaraUrl}) or in game for more information.',
      },
      fields: {
        possibleOrigins: {
          title: 'Possible expansion origins:',
        },
      },
    },
  },
} satisfies BaseTranslation

export default en
