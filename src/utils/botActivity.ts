import type { ActivityOptions, Client } from 'discord.js'
import { ActivityType } from 'discord.js'
import { sample } from 'lodash'

const Activities: ActivityOptions[] = [
  {
    name: 'for tick ⏱',
    type: ActivityType.Watching,
  },
  {
    name: 'to your commands',
    type: ActivityType.Listening,
  },
  { name: 'with the FSD 🚀', type: ActivityType.Playing },
  { name: 'Enjoying Lavian Brandy 🍸', type: ActivityType.Playing },
  { name: 'Mining Platinum ⛏', type: ActivityType.Playing },
  { name: 'That is a big haul 👀', type: ActivityType.Playing },
  { name: 'Top 1% of all bots!', type: ActivityType.Playing },
  { name: 'Simping for Aisling 😍', type: ActivityType.Playing },
  { name: 'Free Conda @ Hutton 😉', type: ActivityType.Playing },
]

export const setRandomActivity = (client: Client) => {
  const activity = sample(Activities)
  client.user?.setActivity({
    name: activity?.name || 'with your heart',
    type: activity?.type || ActivityType.Playing,
  })
}

export const initActivityHandler = (client: Client) => {
  setRandomActivity(client)
  setInterval(() => setRandomActivity(client), 1000 * 60 * 60)
}
