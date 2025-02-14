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
          'Názov: {factionName}\nSkratka: {factionShorthand}\nVernosť: {allegiance}\nPrítomná v systémoch: {systemsCount}\nKanál pre notifikácie: {notificationChannel}',
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
  discordNotification: {
    conflict: {
      title: {
        war: {
          pending: '{emoji} Nadchádzajúca Vojna v {systemName} {emoji}',
          active: '{emoji} Aktívna Vojna v {systemName} {emoji}',
          ended: '{emoji} Ukončená Vojna v {systemName} {emoji}',
        },
        civilWar: {
          pending: '{emoji} Nadchádzajúca Civilná Vojna v {systemName} {emoji}',
          active: '{emoji} Aktívna Civilná Vojna v {systemName} {emoji}',
          ended: '{emoji} Ukončená Civilná Vojna v {systemName} {emoji}',
        },
        election: {
          pending: '{emoji} Nadchádzajúce Voľby v {systemName} {emoji}',
          active: '{emoji} Aktívne Voľby v {systemName} {emoji}',
          ended: '{emoji} Voľby ukončené v {systemName} {emoji}',
        },
      },
      fields: {
        status: {
          title: 'Status',
        },
        oponent: {
          title: 'Oponent:',
        },
        yourStake: {
          title: '💥 Stratené pri prehre',
        },
        opponentStake: {
          title: '🏆 Získané pri víťazstve',
        },
      },
    },
    expansion: {
      title: {
        pending: '✈️ Nadchádzajúca Expanzia ✈️',
        active: '✈️ Aktívna Expanzia ✈️',
        ended: '✈️ Expanzia Ukončená ✈️',
      },
      description: {
        pending:
          'Detegovaná nadchádzajúca expanzia v **{systemName}**.\nSkontrolujte [INARU]({inaraUrl}) alebo hru pre viac informácií.\n\n*Z technických dôvodov nie je možné určiť presný pôvod expanzie v čase jej detekcie.*',
        active:
          'Detegovaná aktívna expanzia v **{systemName}**.\nSkontrolujte [INARU]({inaraUrl}) alebo hru pre viac informácií.\n\n*Z technických dôvodov nie je možné určiť presný pôvod expanzie v čase jej detekcie.*',
        ended:
          'Je príliš skoro na to, aby sme určili, kam sa vaša frakcia expandovala.\nSkontrolujte [INARU]({inaraUrl}) alebo hru pre viac informácií.',
      },
      fields: {
        possibleOrigins: {
          title: 'Možné zdroje expanzie:',
        },
      },
    },
    retreat: {
      title: {
        pending: '⚠️ Nadchádzajúci Ústup ⚠️',
        active: '⚠️ Aktívny Ústup ⚠️',
        ended: '⚠️ Ústup Ukončený ⚠️',
      },
      description: {
        pending:
          'Detegovaný nadchádzajúci ústup v **{systemName}**.\nVplyv: **{influence}**\n[INARA]({inaraUrl})',
        active:
          'Detegovaný aktívny ústup v **{systemName}**.\nVplyv: **{influence}**\n[INARA]({inaraUrl})',
        ended:
          'Ústup v **{systemName}** bol ukončený. Zostali ste v systéme.\nVplyv: **{influence}**\n[INARA]({inaraUrl})',
      },
    },
    influenceThreat: {
      title: '⚠️ {systemName} može byť ohrozený ⚠️',
      description:
        '**{threateningFaction}** je len **{influenceDiff}%** za vašou frakciou!\nČoskoro môže dôjsť ku konfliktu.\n\n- {factionName} (**{factionInfluence}%**)\n- {threateningFaction} (**{threateningFactionInfluence}%**)\n\n[INARA]({inaraUrl})',
    },
  },
} satisfies Translation

export default sk
