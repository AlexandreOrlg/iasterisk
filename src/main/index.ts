import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import PersistentStore from './services/persistentStore'
import { registerIpcHandlers } from './IpcHandlers'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PersistentStoreData } from '../type'
import { TrayService } from './services/trayService'
import { windowManager } from './services/windowManagerService'

let mainWindow: BrowserWindow | null = null
let trayService: TrayService | null = null

export function createWindow(): BrowserWindow {
  // Create the browser window.s
  mainWindow = windowManager.createWindow('main', {
    width: 900,
    height: 670,
    show: false,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {})
  })

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  trayService = new TrayService('logoTemplate.png', mainWindow!)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  registerIpcHandlers()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
export const persistentStore = new PersistentStore<PersistentStoreData>('L4v3R49d0m')
persistentStore.removeFile()

// Initialisation de la nouvelle propriété si elle n'existe pas
if (persistentStore.get('showCorrectionWindow') === undefined) {
  persistentStore.set('showCorrectionWindow', true)
}

persistentStore.on('change', (key, value) => {
  if (key === 'prompts') {
    trayService?.updateMenu(value as PersistentStoreData['prompts'])
  }
})
