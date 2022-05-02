import mongoose from 'mongoose'
import logger from './logger'

// eslint-disable-next-line consistent-return
export const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.DB_URL!)
    logger.info('Connected to MongoDB')
    return mongoose.connection
  } catch (error) {
    logger.error('Error connecting to MongoDB', error)
    process.exit(1)
  }
}
