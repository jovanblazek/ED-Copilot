import { Awaitable, Client, ClientEvents } from 'discord.js'
import { onGuildJoin, onGuildLeave } from './guild'
import { onInteractionCreate } from './interaction'

const EventHandlers: Partial<{
  [key in keyof ClientEvents]: (...args: ClientEvents[key]) => Awaitable<void>
}> = {
  interactionCreate: onInteractionCreate,
  guildCreate: onGuildJoin,
  guildDelete: onGuildLeave,
}

export const initEventHandlers = (client: Client) => {
  Object.entries(EventHandlers).forEach(([event, handler]) => {
    client.on(event, handler)
  })
}
