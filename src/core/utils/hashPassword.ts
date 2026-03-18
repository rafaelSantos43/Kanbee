import CryptoJS from 'crypto-js'
export const hashPassword = (password: string): string => {
  const hash = CryptoJS.SHA256(password).toString()
  return hash
}
