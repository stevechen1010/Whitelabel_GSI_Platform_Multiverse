import { defineStore } from "pinia"
import { useSessionStorage } from "@vueuse/core"

export const useDarkModeStore = defineStore("darkMode", () => {
  const isDarkMode = useSessionStorage<boolean>("isDarkMode", false)

  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status
  }

  return {
    isDarkMode,
    updateIsDarkMode
  }
})
