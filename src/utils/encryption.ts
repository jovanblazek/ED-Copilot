import crypto from 'crypto'

const { ENCRYPTION_KEY = '' } = process.env

const deriveKey = (salt: Buffer) => crypto.scryptSync(ENCRYPTION_KEY, salt, 32)

export const encrypt = (text: string): string => {
  const salt = crypto.randomBytes(16)
  const iv = crypto.randomBytes(16)
  const key = deriveKey(salt)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`
}

export const decrypt = (text: string): string => {
  const [saltHex, ivHex, encryptedHex] = text.split(':')
  const salt = Buffer.from(saltHex, 'hex')
  const iv = Buffer.from(ivHex, 'hex')
  const key = deriveKey(salt)
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
