import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
// @ts-ignore
import { paraglide } from '@inlang/paraglide-sveltekit/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [
      paraglide({
        project: resolve(__dirname, 'project.inlang'),
        outdir: resolve(__dirname, 'src/paraglide')
      }),
      svelte()
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/main/main.html'),
          command: resolve(__dirname, 'src/renderer/command/command.html')
        }
      }
    }
  }
})
