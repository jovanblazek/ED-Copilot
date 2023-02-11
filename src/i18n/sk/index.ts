import type { Translation } from '../i18n-types'

// eslint-disable-next-line @typescript-eslint/naming-convention
const sk = {
  error: {
    unknown: 'Pri vykonávaní príkazu sa vyskytla neznáma chyba 😞',
    systemNotFound: 'Systém `{systemName}` sa nepodarilo nájsť.',
    tickFetchError:
      'Nepodarilo sa získať informácie o ticku. \nSkontroluj [túto stránku](https://elitebgs.app/tick).',
    timeDifferenceError: 'Chyba výpočtu rozdielu časov.',
    dataParseError: 'Chyba pri spracovaní dát.',
    adminOnly: 'Tento príkaz je dostupný iba pre administrátorov.',
    buttonsDisabled: 'Tieto tlačidlá nie sú pre teba!',
    general: 'Nastala chyba. Skús to znova neskôr.',
  },
  ping: {
    response: 'Pong po slovensky',
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
    history: 'História',
  },
  systemInfo: {
    title: 'Frakcie v systéme {systemName}',
    lastUpdate: 'Posledná aktualizácia {time}',
  },
} satisfies Partial<Translation> // Partial because the translation is not complete yet

export default sk
