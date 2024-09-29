import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

export class WindowManagerService {
  private windows: Map<string, BrowserWindow> = new Map()

  createWindow(name: string, options: Electron.BrowserWindowConstructorOptions): BrowserWindow {
    if (this.windows.has(name)) {
      const existingWindow = this.windows.get(name)
      if (existingWindow && !existingWindow.isDestroyed()) {
        existingWindow.show()
        return existingWindow
      }
    }

    const window = new BrowserWindow({
      ...options,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        ...options.webPreferences
      }
    })

    window.loadFile(join(__dirname, `src/renderer/${name}/${name}.html`))

    window.on('closed', () => {
      this.windows.delete(name)
    })

    window.on('ready-to-show', () => {
      window?.show()
    })

    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${name}/${name}.html`)
    } else {
      window.loadFile(join(__dirname, `../renderer/${name}/${name}.html`))
    }

    this.windows.set(name, window)
    return window
  }

  getWindow(name: string): BrowserWindow | undefined {
    return this.windows.get(name)
  }

  closeWindow(name: string): void {
    const window = this.windows.get(name)
    if (window) {
      window.close()
    }
  }
}

export const windowManager = new WindowManagerService()
