export const toUpperCaseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const getStationTypeWithIcon = (stationType: string) => {
  let type
  let priority
  switch (parseInt(stationType)) {
    case 1:
    case 12:
    case 13:
      type = '<:coriolis:822765325350076426> Starport'
      priority = 1
      break
    case 3:
      type = '<:outpost:822765313870397460> Outpost'
      priority = 2
      break
    case 14:
    case 15:
      type = '<:surface:822765337548029962> Planetary port'
      priority = 3
      break
    default:
      type = '<:other:822765350536871946> Other'
      priority = 4
      break
  }
  return { type, priority }
}

export const getTrendPercentage = (trend: string | number) =>
  trend < 0
    ? `<:arrow_red:842824890918764544> ${trend}%`
    : `<:arrow_green:842824851072614487> +${trend}%`
