import { map, reduce } from 'lodash'
import commanderProfile from './commanderProfile'
import copilot from './copilot'
import faction from './faction'
import nearest from './nearest'
import setup from './setup'
import systemDistance from './systemDistance'
import systemInfo from './systemInfo'
import tick from './tick'
import { CommandHandlerArgs } from './types'

type CommandHandlersType = {
  [key: string]: (args: CommandHandlerArgs) => Promise<void>
}

export const Commands = {
  systemDistance,
  tick,
  systemInfo,
  faction,
  commanderProfile,
  copilot,
  setup,
  nearest,
}

export const CommandBuilders = map(Commands, (command) => command.builder.toJSON())

export const CommandHandlers: CommandHandlersType = reduce(
  Commands,
  (commandHandlers, command) => ({
    ...commandHandlers,
    [command.builder.name]: command.handler,
  }),
  {}
)
