import { app, Menu, Tray, BrowserWindow, nativeImage, globalShortcut, clipboard } from 'electron'
import { PersistentStoreData } from '../../type'
import { join } from 'path'
import { createWindow, persistentStore } from '../index'
import AiService from './aiService'
import TextProcessingService from './textProcessingService'
import { windowManager } from './windowManagerService'
import diff from 'fast-diff'

export class TrayService {
  private tray: Tray | null = null
  private mainWindow: BrowserWindow | null = null
  private registeredShortcuts: string[] = []
  private animationInterval: NodeJS.Timeout | null = null
  private commandWindow: BrowserWindow | null = null

  constructor(iconName: string, mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    const iconPath = nativeImage.createFromPath(join(__dirname, `../../resources/${iconName}`))
    this.tray = new Tray(iconPath)
    this.updateMenu(persistentStore.get('prompts') ?? [])
  }

  updateMenu(prompts: PersistentStoreData['prompts']): void {
    const showCorrectionWindow = persistentStore.get('showCorrectionWindow')
    const contextMenu = Menu.buildFromTemplate([
      ...prompts.map((prompt) => ({
        label: `${prompt.name}`,
        accelerator: prompt.shortcut.join('+'),
        click: (): void => {
          this.activatePrompt(prompt.name)
        }
      })),
      { type: 'separator' },
      {
        label: 'Afficher la fenêtre de correction',
        type: 'checkbox',
        checked: showCorrectionWindow,
        click: (): void => {
          const newValue = !showCorrectionWindow
          persistentStore.set('showCorrectionWindow', newValue)
          this.updateMenu(prompts)
        }
      },
      {
        label: 'Settings',
        click: (): void => this.showSettings()
      },
      { type: 'separator' },
      { label: 'Quit', click: (): void => app.quit() }
    ])

    this.tray!.setContextMenu(contextMenu)
    this.registerShortcuts(prompts)
  }

  private registerShortcuts(prompts: PersistentStoreData['prompts']): void {
    // Unregister previous shortcuts
    this.registeredShortcuts.forEach((shortcut) => {
      globalShortcut.unregister(shortcut)
    })
    this.registeredShortcuts = []

    // Register new shortcuts
    prompts.forEach((prompt) => {
      const shortcut = prompt.shortcut.join('+')
      if (shortcut && shortcut.length > 0) {
        const success = globalShortcut.register(shortcut, () => {
          this.activatePrompt(prompt.name)
        })
        if (success) {
          this.registeredShortcuts.push(shortcut)
        } else {
          console.warn(`Failed to register shortcut: ${shortcut}`)
        }
      } else {
        console.warn(`Invalid shortcut for prompt: ${prompt.name}`)
      }
    })
  }

  private async activatePrompt(promptName: string): Promise<void> {
    console.log(`Activating prompt: ${promptName}`)

    const prompt = persistentStore.get('prompts')?.find((p) => p.name === promptName)
    if (!prompt) {
      return
    }

    const clipboardText = await clipboard.readText()

    this.setProcessingIcon()

    const modelConfig = persistentStore.get('modelConfig')

    if (!modelConfig) {
      return
    }

    const aiService = new AiService(modelConfig.provider, {
      apiKey: modelConfig.apiKey,
      model: modelConfig.model
    })
    const textProcessingService = new TextProcessingService(aiService)

    try {
      const showCorrectionWindow = persistentStore.get('showCorrectionWindow')
      if (showCorrectionWindow) {
        this.showCorrectionWindow()
      }
      let textChunked = ''
      const correctedText = await textProcessingService.processText(
        'correction',
        clipboardText,
        prompt.content,
        (chunk) => {
          textChunked += chunk
          const result = diff(clipboardText, textChunked)

          if (showCorrectionWindow) {
            this.commandWindow?.webContents.send('diff-text', result)
          }
        }
      )
      if (showCorrectionWindow) {
        this.commandWindow?.webContents.send('correction-complete', correctedText)
      } else {
        clipboard.writeText(correctedText)
      }
    } catch (error) {
      console.error('Error processing text:', error)
    } finally {
      this.setNormalIcon()
      console.log('Normal icon set')
    }
  }

  private setProcessingIcon(): void {
    this.startIconAnimation()
  }

  private setNormalIcon(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
      this.animationInterval = null
    }
    const iconPath = nativeImage.createFromPath(join(__dirname, '../../resources/logoTemplate.png'))
    this.tray!.setImage(iconPath)
  }

  private startIconAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
    }

    const frames = 10 // Nombre de frames pour une rotation complète
    let currentFrame = 0

    this.animationInterval = setInterval(() => {
      const iconPath = join(
        __dirname,
        `../../resources/loader/frame-${currentFrame + 1}Template.png`
      )
      console.log('iconPath : ', iconPath)
      const image = nativeImage.createFromPath(iconPath)
      this.tray!.setImage(image)

      currentFrame = (currentFrame + 1) % frames
    }, 80) // Ajustez cet intervalle pour contrôler la vitesse de rotation
  }

  private showSettings(): void {
    if (this.mainWindow?.isDestroyed() || !this.mainWindow) {
      this.mainWindow = createWindow()
    } else if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore()
    } else {
      this.mainWindow.show()
    }
  }

  private showCorrectionWindow(): void {
    if (this.commandWindow) {
      this.commandWindow.focus()
    } else {
      this.commandWindow = windowManager.createWindow('command', {
        width: 700,
        height: 300,
        frame: false,
        vibrancy: 'menu', // on MacOS
        backgroundMaterial: 'acrylic', // on Windows 11
        alwaysOnTop: true, // Ajoutez cette ligne
        focusable: true // Ajoutez cette ligne
      })

      this.commandWindow.on('closed', () => {
        this.commandWindow = null
      })

      this.commandWindow.on('blur', () => {
        if (this.commandWindow) {
          this.commandWindow.close()
        }
      })
    }
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
    }
    // Unregister all shortcuts
    this.registeredShortcuts.forEach((shortcut) => {
      globalShortcut.unregister(shortcut)
    })
    this.registeredShortcuts = []
  }
}
