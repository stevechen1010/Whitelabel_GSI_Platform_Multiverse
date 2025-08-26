import { Composer } from "vue-i18n"

export {}

declare global {
  interface Window {
    fbq?: (method: string, ...args: any[]) => void
    LiveChatWidget?: {
      call(method: string, ...args: any[]): void
    }
    Tawk_API: {
      onStatusChange(status: string): void
      start(): void
    }
  }

  var $t: Composer["t"]
}
