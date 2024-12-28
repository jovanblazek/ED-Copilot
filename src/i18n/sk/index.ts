import type { Translation } from '../i18n-types'

// eslint-disable-next-line @typescript-eslint/naming-convention
const sk = {
  error: {
    unknown: 'Vyskytla sa neznáma chyba 😞',
    general: 'Niečo sa pokazilo. Skúste to znova neskôr.',
    systemNotFound: 'Nepodarilo sa nájsť systém s názvom `{systemName}`.',
    tickFetchError:
      'Nepodarilo sa načítať dáta o ticku. \nSkontrolujte [túto stránku](https://elitebgs.app/tick).',
    dataParseError: 'Nepodarilo sa spracovať dáta.',
    buttonsDisabled: 'Tieto tlačidlá nie sú pre teba!',
  },
  copilot: {
    faction: {
      notFound: 'Nepodarilo sa nájsť žiadne frakcie s týmto názvom.',
      confirm: {
        title: 'Sú tieto informácie správne?',
        description:
          'Názov: {factionName}\nSkratka: {factionShorthand}\nVernosť: {allegiance}\nPrítomná v systémoch: {systemsCount}\nKanál na notifikácie: {notificationChannel}',
      },
      saved: 'Frakcia uložená.',
      canceled: 'Nastavenie frakcie bolo zrušené.',
    },
    language: {
      saved: 'Nastavenia jazyka uložené.',
    },
    timezone: {
      saved: 'Nastavenie časového pásma uložené.',
      canceled:
        'Nastavenie časového pásma bolo zrušené. Ak máte problémy s nastavením časového pásma, skúste nájsť vaše časové pásmo na [tejto stránke](https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a).',
      notFound:
        'Nepodarilo sa nájsť časového pásma s týmto názvom. Skúste nájsť vaše časové pásmo na [tejto stránke](https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a).',
      confirm: {
        title: 'Sú tieto informácie správne?',
        description: 'Aktuálny čas: {currentTime}',
      },
    },
    tickReportChannel: {
      title: 'Aktuálny kanál pre hlásenie tickov',
      description: 'Kanál: {channel}\nSte si istí, že ho chcete odstrániť?',
      descriptionNoChannel: 'Kanál: -',
      saved: 'Kanál {channel} bude teraz použitý na hlásenie herných tickov.',
      removed: 'Kanál pre hlásenie tickov odstránený.',
      notRemoved: 'Kanál {channel} zostane použitý na hlásenie herných tickov.',
    },
  },
  faction: {
    notSetup: 'Frakcia nie je nastavená.',
    conflicts: {
      title: '{factionName} Konflikty',
      noConflicts: 'Žiadne konflikty 🎉',
      pendingConflict: 'Začína',
    },
    systems: {
      title: '{factionName} Systémy',
    },
    stations: {
      title: '{factionName} Stanice',
    },
  },
  techBroker: {
    title: 'Technology Brokeri',
  },
  materialTrader: {
    title: 'Material Traderi',
  },
  interstellarFactors: {
    title: 'Interstellar Factors',
  },
  tick: {
    title: 'Posledný TICK',
    wasToday: 'Dnes',
    history: 'História tickov',
  },
  systemInfo: {
    title: 'Frakcie v {systemName}',
    lastUpdate: 'Posledná aktualizácia: {time}',
  },
  commanderProfile: {
    notFound:
      'Nepodarilo sa nájsť profil commandera.\nPridajte svoje meno a EDSM API kľúč pomocou príkazu `/setup profile`.',
    missingEdsmKey:
      'Ak chcete vidieť zostatok kreditov na účte, musíte pridať svoj EDSM API kľúč pomocou príkazu `/setup profile`.',
  },
  setup: {
    profile: {
      saved: 'Nastavenia profilu uložené.',
    },
  },
} satisfies Translation

export default sk
