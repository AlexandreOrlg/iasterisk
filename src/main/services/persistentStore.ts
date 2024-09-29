import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import crypto from 'crypto'
import { EventEmitter } from 'events'

interface StoreSchema {
  [key: string]: any
}

class PersistentStore<T extends StoreSchema> extends EventEmitter {
  private data: { [K in keyof T]?: string }
  private filePath: string
  private encryptionKey: Buffer

  constructor(encryptionKey: string, filename: string = 'store.json') {
    super()
    this.filePath = path.join(app.getPath('userData'), filename)
    this.encryptionKey = this.deriveKey(encryptionKey)
    this.data = this.loadData()
  }
  private deriveKey(key: string): Buffer {
    // Utilise SHA-256 pour obtenir une clé de 32 octets à partir de n'importe quelle chaîne
    return crypto.createHash('sha256').update(String(key)).digest()
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, encryptedHex] = encryptedText.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv)
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  private loadData(): { [K in keyof T]?: string } {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8')
        return JSON.parse(fileContent)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
    return {}
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data), 'utf-8')
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  get<K extends keyof T>(key: K): T[K] | undefined {
    const encryptedValue = this.data[key]
    if (encryptedValue) {
      try {
        const decryptedValue = this.decrypt(encryptedValue)
        return JSON.parse(decryptedValue) as T[K]
      } catch (error) {
        console.error('Error decrypting value:', error)
        return undefined
      }
    }
    return undefined
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    const stringValue = JSON.stringify(value)
    this.data[key] = this.encrypt(stringValue)
    this.saveData()
    this.emit('change', key, value)
  }

  delete<K extends keyof T>(key: K): void {
    delete this.data[key]
    this.emit('change', key, undefined)
    this.saveData()
  }

  clear(): void {
    this.data = {}
    this.saveData()
  }

  has<K extends keyof T>(key: K): boolean {
    return key in this.data
  }

  getAll(): T {
    const decryptedData: Partial<T> = {}
    for (const [key, value] of Object.entries(this.data)) {
      if (value) {
        try {
          const decryptedValue = this.decrypt(value)
          decryptedData[key as keyof T] = JSON.parse(decryptedValue)
        } catch (error) {
          console.error(`Error decrypting value for key ${key}:`, error)
        }
      }
    }
    return decryptedData as T
  }

  setAll(value: T): void {
    this.data = {}
    for (const [key, val] of Object.entries(value) as [keyof T, T[keyof T]][]) {
      const stringValue = JSON.stringify(val)
      this.data[key] = this.encrypt(stringValue)
      this.emit('change', key, val)
    }
    this.saveData()
  }

  removeFile(): void {
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath)
    }
  }
}

export default PersistentStore
