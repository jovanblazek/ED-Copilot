import { map, reduce } from 'lodash'
import { CommandCallbackArgs } from '../classes'
import faction from './faction'
import interstellarFactors from './interstellarFactors'
import materialTrader from './materialTrader'
import ping from './ping'
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
