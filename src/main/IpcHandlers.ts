import { clipboard, ipcMain } from 'electron'
import { persistentStore } from './index'
import type { PersistentStoreData } from '../type'
import { windowManager } from './services/windowManagerService'

export function registerIpcHandlers(): void {
  ipcMain.handle('getPersistentStoreValue', async (_event, key: keyof PersistentStoreData) => {
    return persistentStore.get(key)
  })

  ipcMain.handle(
    'setPersistentStoreValue',
    async (_event, key: keyof PersistentStoreData, value: PersistentStoreData[typeof key]) => {
      persistentStore.set(key, value)
    }
  )
  
  ipcMain.on('apply-correction', (_, correctedText) => {
    windowManager.getWindow('command')?.close();
    clipboard.writeText(correctedText)
  })
}

