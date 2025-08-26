import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { computed } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommonQueryString } from "src/common/composables/useCommonQueryString"
import { CMS_OPENING_METHOD } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { Events } from "src/boot/eventbus/types"
import type * as Request from "src/api/request.type"
import { useRouter } from "vue-router"
import { MENU } from "../utils/constants"
import { useLiveChat } from "src/common/hooks/useLiveChat"

export function useSiteRedirect() {
  const $q = useQuasar()
  const { t } = useI18n()
  const eventbus = injectStrict(EventBusKey)
  const router = useRouter()
  const { isLogin, isMayaLogin } = useAuth()
  const { isGCashLogin } = useUserInfo()
  const { handleGameQueryString } = useCommonQueryString()
  const { isMain } = useEnv()

  const enviromentErrorMsg = () => {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("error_message.environmentError"),
      icon: "warning",
      timeout: 1000
    })
  }

  const handleEventShow = (item: Request.RedirectPayload, eventName: keyof Events) => {
    router.replace({ query: item.query })
    setTimeout(() => {
      eventbus.emit(eventName, true)
    }, 0)
  }

  const handleSiteRedirect = (item: Request.RedirectPayload) => {
    const routerName = MENU.RouterNameMapping[item.did]
    let returnFlag = false
    switch (item.did) {
      /*
        * 僅限存取款
        1. 未登入狀態，彈出登入視窗
        2. 若為 Maya 登入，彈出存款視窗
        3. 一般登入，跳轉至存款頁面
      */
      case "deposit":
        if (!isLogin.value) return eventbus.emit("openLogin", true)
        handleRedirectDeposit()
        returnFlag = true
        break
      case "withdrawal":
        if (!isLogin.value) return eventbus.emit("openLogin", true)
        handleRedirectWithdrawal()
        returnFlag = true
        break
      case "basic_information":
      case "withdrawal_setting":
      case "change_password":
      case "site_message":
      case "vip":
      case "member_level":
      case "history":
      case "processing_order":
      case "kyc":
      case "affiliate_detail":
      case "strategy_detail":
      case "member_strategy":
      case "member_level":
      case "agent_collaboration_strategy":
        if (!isLogin.value) {
          handleEventShow(item, "openLogin")
          return
        }
        break
      case "register":
        if (!isLogin.value) {
          handleEventShow(item, "openRegister")
          return
        }
        break
      case "forget_password":
        // 忘記密碼彈窗只在未登入狀態下顯示
        if (!isLogin.value) {
          handleEventShow(item, "openForgotPassword")
          return
        }
        break
      case "contact_us":
        // 聯絡我們則直接呼叫 live chat hook
        const { handleOpenLiveChat } = useLiveChat()
        handleOpenLiveChat()
        returnFlag = true
        break
      default:
        break
    }

    if (returnFlag) return

    if (item.opening_method === CMS_OPENING_METHOD.Enums.NEW_TAB) {
      const routeData = router.resolve({
        name: routerName,
        query: item.query
      })
      window.open(routeData.href, "_blank")
      return
    }
    router.push({ name: routerName, query: item.query })
  }

  const gcashLink = ({ isDeposit = false }) => {
    let query = ""

    if (isDeposit) {
      query = "?isDeposit=1&query=isDeposit=1"
    }

    if (isMain.value) {
      return `https://gcashdev.page.link/?link=https://gcash.splashscreen/?redirect=gcash://com.mynt.gcash/app/006300121300?appId=2170020225779614&page=pages/index/index${query}&apn=com.globe.gcash.android.uat&isi=520020791&ibi=com.globetel.gcash.uat`
    }

    return `https://gcashdev.page.link/?link=https://gcash.splashscreen/?redirect=gcash://com.mynt.gcash/app/006300121300?appId=2170020225779614&page=pages/index/index${query}&apn=com.globe.gcash.android.uat&isi=520020791&ibi=com.globetel.gcash.uat`
  }

  const handleRedirectDeposit = () => {
    if (isMayaLogin.value) {
      eventbus.emit("openDepositDialog", true)
      return
    }

    if (isGCashLogin.value) {
      window.open(gcashLink({ isDeposit: true }))
      return
    }

    enviromentErrorMsg()
  }

  const handleRedirectWithdrawal = () => {
    if (isMayaLogin.value) {
      eventbus.emit("openWithdrawalDialog", true)
      return
    }

    if (isGCashLogin.value) {
      window.open(gcashLink({ isDeposit: false }))
      return
    }

    enviromentErrorMsg()
  }

  // 各版型可自行擴充pup, currency, lang, useDialogIframe
  const handleSiteQueryString = () => {
    handleGameQueryString({ pup: true, useDialogIframe: true })
  }

  return {
    /** 路由跳轉 */
    handleSiteRedirect,

    /** 跳轉存款 */
    handleRedirectDeposit,

    /** 跳轉出款 */
    handleRedirectWithdrawal,

    /** 處理queryString */
    handleSiteQueryString
  }
}
