import mongoose from 'mongoose'

export type FactionType = {
  guildId: string
  name: string
  shorthand: string
  ebgsId: string
  eddbId: number
}

interface IFaction {
  guildId: string
  name: string
  shorthand: string
  ebgsId: string
  eddbId: number
}

const FactionSchema = new mongoose.Schema<IFaction>({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  shorthand: {
    type: String,
    required: true,
  },
  ebgsId: {
    type: String,
    required: true,
  },
  eddbId: {
    type: Number,
    required: true,
  },
})

export default mongoose.model<IFaction>('Faction', FactionSchema)
