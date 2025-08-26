import { useRouter } from "vue-router"
import { useGame } from "src/common/composables/useGame"
import { useAgentCode } from "src/common/hooks/useAgentCode"

export function useLocalCommon() {
  const router = useRouter()
  const { openGame } = useGame()
  const { isAGLM } = useAgentCode()

  const SA_GAME_PRODUCT_CODE = 1185,
    AG_GAME_PRODUCT_CODE = 1203

  const afterLogin = async () => {
    await router.push({ path: "/" })
    await new Promise((resolve) => setTimeout(resolve, 500))
    await openCurrentGame()
  }

  const openCurrentGame = async () => {
    await router.push({ path: "/" })
    if (isAGLM.value) {
      await openGame(AG_GAME_PRODUCT_CODE, "", "", false, null)
      return
    }
    await openGame(SA_GAME_PRODUCT_CODE, "", "", false, null)
  }

  return {
    afterLogin,
    openCurrentGame
  }
}
