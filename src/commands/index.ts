import { map, reduce } from 'lodash'
import { CommandCallbackArgs } from '../classes'
import commanderProfile from './commanderProfile'
import faction from './faction'
import interstellarFactors from './interstellarFactors'
import materialTrader from './materialTrader'
import ping from './ping'
import setup from './setup'
import systemDistance from './systemDistance'
import systemInfo from './systemInfo'
import techBroker from './techBroker'
import tick from './tick'

type CommandHandlersType = {
  [key: string]: (args: CommandCallbackArgs) => Promise<void>
}

export const Commands = {
  ping,
  techBroker,
  materialTrader,
  interstellarFactors,
  systemDistance,
  tick,
  systemInfo,
  faction,
  commanderProfile,
  setup,
}

export const CommandBuilders = map(Commands, (command) => command.builder.toJSON())

export const CommandHandlers: CommandHandlersType = reduce(
  Commands,
  (commandHandlers, command) => ({
    ...commandHandlers,
    [command.params.name]: command.callback,
  }),
  {}
)
