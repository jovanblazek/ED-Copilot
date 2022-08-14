import CryptoJS from 'crypto-js'

const { ENCRYPTION_KEY } = process.env

export const encrypt = (text: string) => CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()

export const decrypt = (text: string) =>
  CryptoJS.AES.decrypt(text, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
