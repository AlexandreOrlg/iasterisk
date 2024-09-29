import './assets/main.css'

import App from './App.svelte'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const app = new App({
  target: document.getElementById('app')
})

export default app
