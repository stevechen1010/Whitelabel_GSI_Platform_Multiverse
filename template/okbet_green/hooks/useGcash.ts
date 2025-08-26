import { ref, onMounted } from "vue"
import { useQuasar } from "quasar"

declare global {
  interface Window {
    my: any // 根据实际 API 定义更具体的类型
  }
}

export function useGcash() {
  const $q = useQuasar()
  const isScriptLoaded = ref(false)

  function init() {
    if (isScriptLoaded.value) return Promise.resolve()

    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = "https://appx/web-view.min.js"
      script.onload = () => {
        isScriptLoaded.value = true
        resolve(true)
      }
      script.onerror = (error) => reject(error)
      document.head.appendChild(script)

      if (window.my) {
        window.my.onMessage = onMessage
      }
    })
  }

  function postMessage(method: string) {
    window.my.postMessage({ method })
  }

  function onMessage(e: any) {
    console.log("[onMessage] : ", JSON.stringify(e))
    $q.notify({
      type: "negative",
      position: "top",
      message: `[onMessage] : ${JSON.stringify(e)}`,
      icon: "warning",
      timeout: 1000
    })
  }

  function checkGcashEnv() {
    return window.my.getEnv(function (res: any) {
      return res.miniprogram
    })
  }

  // 初始化 web-view
  onMounted(async () => {
    try {
      init()
    } catch (error) {
      console.error("Failed to load gcash:", error)
    }
  })

  return {
    postMessage,
    onMessage,
    checkGcashEnv
  }
}
