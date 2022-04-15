import dotenv from 'dotenv'
import path from 'path'

const ENV_FILE_PATH = '../.env'

dotenv.config({ path: path.join(__dirname, ENV_FILE_PATH) })
