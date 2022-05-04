import mongoose from 'mongoose'

interface IUser {
  userId: string
  edsmApiKey: string
  cmdrName: string
}

const UserSchema = new mongoose.Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  edsmApiKey: {
    type: String,
    required: true,
  },
  cmdrName: {
    type: String,
    required: true,
  },
})

export default mongoose.model<IUser>('User', UserSchema)
