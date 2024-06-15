import { Ranks } from '../constants'

export type InaraEvent = {
  eventCustomID?: number
  eventName: string
  eventTimestamp?: string
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  eventData: unknown | unknown[]
}

export type InaraResponse<T> = {
  header: {
    eventStatus: number
  }
  events: {
    eventCustomID?: number
    eventStatus: number
    eventStatusText?: string
    eventData: T
  }[]
}

export type InaraProfile = {
  userID: number
  userName: string
  commanderName: string
  commanderRanksPilot: {
    rankName: keyof typeof Ranks
    rankValue: number
    rankProgress: number
  }[]
  avatarImageURL?: string
  inaraURL: string
  otherNamesFound: string[]
}
