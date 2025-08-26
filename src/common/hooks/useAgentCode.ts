import { computed } from "vue"
import { useEnv } from "src/common/hooks/useEnv"

// 想要和 GOG 相同邏輯的代理商，可以在此擴充
const GOG_AGENTS = ["gog1", "8888", "gogd", "hai1"]
const RYSM_AGENTS = ["rys1"]
const BXM9_AGENTS = ["9bx1"]
const AGLM_AGENTS = ["agl1"]
const A99M_AGENTS = ["a991", "dobr"]
const NBL1_AGENTS = ["nbl1"]
const NS4M_AGENTS = ["ns41", "obrb"]

// 想要切換 CNY 為 USDT 的代理商，可以在此擴充
const CNY_TO_USDT_AGENTS = [...GOG_AGENTS]

// 共用檢查
const checkAgentCode = (options: { agentList: string[]; agentCode: string }) => {
  try {
    if (!options || !options.agentCode) {
      console.warn(`agent code: ${options.agentCode} not found.`)
      return false
    }
    return options.agentList.includes(options.agentCode.toLowerCase())
  } catch (error) {
    console.error(error)
    return false
  }
}

export function useAgentCode() {
  const { envData } = useEnv()
  // 沒拿到 agentCode 則預設為空字串
  const { agentCode = "" } = envData()

  const isCNYToUSDT = computed(() =>
    checkAgentCode({
      agentList: CNY_TO_USDT_AGENTS,
      agentCode
    })
  )

  const isGOG = computed(() => checkAgentCode({ agentList: GOG_AGENTS, agentCode }))
  const isRYSM = computed(() => checkAgentCode({ agentList: RYSM_AGENTS, agentCode }))
  const isBXM9 = computed(() => checkAgentCode({ agentList: BXM9_AGENTS, agentCode }))
  const isAGLM = computed(() => checkAgentCode({ agentList: AGLM_AGENTS, agentCode }))
  const isA99M = computed(() => checkAgentCode({ agentList: A99M_AGENTS, agentCode }))
  const isNBL1 = computed(() => checkAgentCode({ agentList: NBL1_AGENTS, agentCode }))
  const isNS4M = computed(() => checkAgentCode({ agentList: NS4M_AGENTS, agentCode }))

  /// 傳入agentCodeList 只要符合當前 agentCode 則返回 true
  const allowAgentCodes = (agentCodeList: Array<string>) => {
    return agentCodeList.find((code: string) => code.toLowerCase() === agentCode.toLowerCase()) !== undefined
  }

  const currentAgentCode = computed(() => {
    return agentCode
  })

  return {
    isCNYToUSDT,
    isGOG,
    isRYSM,
    isBXM9,
    isAGLM,
    isA99M,
    isNBL1,
    isNS4M,
    currentAgentCode,
    allowAgentCodes
  }
}
