import { Emojis } from '../constants'

export const toUpperCaseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const getStationTypeWithIcon = (stationType: string) => {
  let type
  let priority
  switch (parseInt(stationType)) {
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
      type = `${Emojis.other} Other`
      priority = 4
      break
  }
  return { type, priority }
}

export const getTrendPercentage = (trend: string | number) =>
  trend < 0
    ? `<:arrow_red:842824890918764544> ${trend}%`
    : `<:arrow_green:842824851072614487> +${trend}%`

export const addCommasToNumber = (x: number): string =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
