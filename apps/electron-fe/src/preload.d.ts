declare global {
  interface Window {
    api: import('@electron-nx/prerender-api').Api
  }
}

export {}