import { defineStore } from "pinia"
import { useSessionStorage } from "@vueuse/core"

export const useAgeVerificationStore = defineStore("ageVerification", () => {
  const alreadyShow = useSessionStorage<boolean>("alreadyShowAgeVerification", false)

  const updateAlreadyShow = () => {
    alreadyShow.value = true
  }

  return {
    alreadyShow,
    updateAlreadyShow
  }
})
