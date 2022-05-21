import mongoose from 'mongoose'
import { fieldEncryption } from 'mongoose-field-encryption'

interface IUser {
  userId: string
  cmdrName: string
  edsmApiKey: string | null
}

const UserSchema = new mongoose.Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  cmdrName: {
    type: String,
    required: true,
  },
  edsmApiKey: {
    type: String || null,
    required: false,
    default: null,
  },
})

UserSchema.plugin(fieldEncryption, {
  fields: ['edsmApiKey'],
  secret: process.env.MONGOOSE_ENCRYPTION_SECRET,
})

export default mongoose.model<IUser>('User', UserSchema)
