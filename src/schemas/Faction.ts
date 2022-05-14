import mongoose from 'mongoose'

interface IFaction {
  discordGuildId: string
  name: string
  shorthand: string
  ebgsId: string
  eddbId: number
}

const FactionSchema = new mongoose.Schema<IFaction>({
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
