import mongoose from 'mongoose'

export type PreferencesType = {
  guildId: string
  tickReportChannelId: string | null
  language: string
  timezone: string
}

interface IPreferences {
  guildId: string
  tickReportChannelId: string | null
  language: string
  timezone: string
}

const PreferencesSchema = new mongoose.Schema<IPreferences>({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  tickReportChannelId: {
    type: String || null,
    required: false,
    default: null,
  },
  language: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
})

export default mongoose.model<IPreferences>('Preferences', PreferencesSchema)
