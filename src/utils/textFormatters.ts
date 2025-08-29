import { Emojis } from '../constants'

export const toUpperCaseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const getStationTypeWithIcon = (stationType: string) => {
  let type
  let priority
  switch (parseInt(stationType, 10)) {
    case 1:
    case 12:
    case 13:
      type = `${Emojis.coriolis} Station`
      priority = 1
      break
    case 3:
      type = `${Emojis.coriolis} Outpost`
      priority = 2
      break
    case 14:
    case 15:
      type = `${Emojis.surfacePort} Planetary port`
      priority = 3
      break
    default:
      type = `${Emojis.planetarySettlement} Other`
      priority = 4
      break
  }
  return { type, priority }
}

export const addCommasToNumber = (x: number): string =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
