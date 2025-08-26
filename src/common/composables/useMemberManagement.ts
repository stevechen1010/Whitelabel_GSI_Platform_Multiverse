import type * as Request from "src/api/request.type"
import type * as Response from "src/api/response.type"
import { useQuasar } from "quasar"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { WALLET_TYPE, MEMBER_AGENT_QUOTA_SEARCH_TYPE } from "src/common/utils/constants"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"

export function useMemberManagement() {
  const $q = useQuasar()
  const { t } = useI18n()
  const { preciseMultiply, preciseDivide } = useCommon()
  const {
    inUseWallet,
    getMemberAgentQuotaBalance,
    getMemberAgentQuotaMoneyHistory,
    updateMemberAgentQuotaBalance,
    getMemberAgentQuotaAmount
  } = useUserInfo()

  const activeTab = ref("manage")
  const menuRef = ref()
  const datePickerShow = ref(false)
  const referralCode = ref("-")
  const page = ref(1) // 頁數
  const offset = ref(0) // 當前筆數
  const size = ref(20) // 每頁顯示數量
  const totalPage = ref(0) // 總共有幾頁
  const showDialog = ref(false)
  const remainQuotaAmount = ref(0)
  const dialogType = ref(1)
  const targetAccount = ref()
  const dialogAmount = ref("")
  const dialogMemberIsAgent = ref(false)
  const dialogIncreaseItem = ref(0)
  const dialogIncreaseItemOptions = computed(() => {
    if (dialogIncreaseItem.value === -1) {
      return [
        { label: t("shareholder_platform.please_select"), value: -1 },
        { label: t("common.btn.point"), value: 0 },
        { label: t("member.membershipManagement.agent_quota"), value: 1, disable: !dialogMemberIsAgent.value }
      ]
    } else {
      return [
        { label: t("common.btn.point"), value: 0 },
        { label: t("member.membershipManagement.agent_quota"), value: 1, disable: !dialogMemberIsAgent.value }
      ]
    }
  })
  const memberAccount = ref("")
  const dateRange = ref({ from: "", to: "" })
  const changeType = ref(0)
  const manageRows = ref<Response.GetMemberAgentQuotaBalance[]>([])
  const detailRows = ref<Response.GetMemberAgentQuotaMoneyHistory[]>([])

  const changeTypeOptions = computed(() => {
    return [
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.All]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.All
      },
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualAddition]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualAddition
      },
      {
        label: t(MEMBER_AGENT_QUOTA_SEARCH_TYPE.I18nKeys[MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualDeduction]),
        value: MEMBER_AGENT_QUOTA_SEARCH_TYPE.Enums.ManualDeduction
      }
    ]
  })
  const manageColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.account"), field: "member_account", align: "left" as const },
      { name: "register_date", label: t("tableHeader.registerTime"), field: "register_date", align: "left" as const },
      {
        name: "last_login_date",
        label: t("tableHeader.lastLoginTime"),
        field: "last_login_date",
        align: "left" as const
      },
      { name: "balance", label: t("common.btn.point"), field: "balance", align: "left" as const },
      {
        name: "remain_quota_amount",
        label: t("tableHeader.balance"),
        field: "remain_quota_amount",
        align: "left" as const
      },
      { name: "actions", label: t("tableHeader.operating"), field: "actions", align: "left" as const }
    ]
  })
  const detailColumns = computed(() => {
    return [
      { name: "member_account", label: t("menu.account"), field: "member_account", align: "left" as const },
      {
        name: "updated_at_unix",
        label: t("tableHeader.accountChangeTime"),
        field: "updated_at_unix",
        align: "left" as const
      },
      { name: "action_type", label: t("tableHeader.accountType"), field: "action_type", align: "left" as const },
      {
        name: "transaction_code",
        label: t("tableHeader.accountVariableObject"),
        field: "transaction_code",
        align: "center" as const
      },
      { name: "amount", label: t("tableHeader.amount"), field: "amount", align: "left" as const },
      {
        name: "before_balance",
        label: t("tableHeader.amountBeforeChanges"),
        field: "before_balance",
        align: "left" as const
      },
      {
        name: "after_balance",
        label: t("tableHeader.amountAfterChange"),
        field: "after_balance",
        align: "left" as const
      }
    ]
  })

  const formattedDateRange = computed(() => {
    if (typeof dateRange.value === "string") {
      if (dateRange.value === "") return ""
      return `${dateRange.value} 00:00:00 ~ ${dateRange.value} 23:59:59`
    } else {
      if (!dateRange.value.from || !dateRange.value.to) return ""
      return `${dateRange.value.from} 00:00:00 ~ ${dateRange.value.to} 23:59:59`
    }
  })

  const formattedStartDate = computed(() => {
    if (!dateRange.value.from) return ""

    return `${dateRange.value.from} 00:00:00`
  })

  const formattedEndDate = computed(() => {
    if (!dateRange.value.to) return ""

    return `${dateRange.value.to} 23:59:59`
  })

  const hideMenu = () => {
    menuRef.value.hide()
  }

  const handlerChangeActiveTab = (newTab: string) => {
    console.log("newTab :>> ", newTab)
    resetPage()

    if (newTab === "manage") {
      handlerGetMemberAgentQuotaBalance()
      handlerGetMemberAgentQuotaAmount()
    } else if (newTab === "detail") {
      changeDetailActiveTab()
    }
  }

  const onInputChange = (val: string | number | null) => {
    const strVal = typeof val === "string" ? val : val !== null ? String(val) : ""
    // 過濾掉非數字與小數點、限制只有一個小數點
    const cleaned = strVal
      .replace(/[^\d.]/g, "") // 移除非數字和小數點
      .replace(/^\.{1,}/g, "") // 不允許開頭是小數點
      .replace(/(\..*)\./g, "$1") // 僅保留第一個小數點

    dialogAmount.value = cleaned
  }

  const searchTypeName = (type: number) => {
    const label = changeTypeOptions.value.find((e) => e.value === type)?.label as string
    if (label) return t(label)
    return "-"
  }

  const parseDate = (dateStr: number | string) => {
    const time = Number(dateStr)

    if (time <= 0) return "-"

    const date = new Date(preciseMultiply(time, 1000))

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") // 月份從 0 開始
    const day = String(date.getDate()).padStart(2, "0")

    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const resetPage = () => {
    page.value = 1
    offset.value = 0
    totalPage.value = 0
    datePickerShow.value = false
  }

  const handleChangePage = (newPage: number) => {
    offset.value = (newPage - 1) * size.value

    if (activeTab.value === "manage") {
      handlerGetMemberAgentQuotaBalance()
      handlerGetMemberAgentQuotaAmount()
    } else if (activeTab.value === "detail") {
      handlerGetMemberAgentQuotaMoneyHistory()
    }
  }

  const changeDetailActiveTab = () => {
    memberAccount.value = ""
    dateRange.value = { from: "", to: "" }
    changeType.value = 0
    detailRows.value = []
  }

  /** 搜尋帳變明細 */
  const handlerSearchAccountAmount = async () => {
    if (!memberAccount.value) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseEnterUserAccount"),
        position: "top"
      })
      return
    }

    if (
      (typeof dateRange.value === "string" && !dateRange.value) ||
      (typeof dateRange.value === "object" && (!dateRange.value.from || !dateRange.value.to))
    ) {
      $q.notify({
        type: "negative",
        message: t("placeholder.pleaseSelectDate"),
        position: "top"
      })
      return
    }

    resetPage()

    await handlerGetMemberAgentQuotaMoneyHistory()
  }

  /** 打開加減款彈窗 */
  const handlerClickOperation = (account: string, type: number, isMemberAgent: boolean) => {
    targetAccount.value = account
    dialogAmount.value = ""
    dialogType.value = type
    dialogMemberIsAgent.value = isMemberAgent
    showDialog.value = true

    handlerGetMemberAgentQuotaAmount()
  }

  const handlerGetMemberAgentQuotaAmount = async () => {
    if (!inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id) return
    const { data } = await getMemberAgentQuotaAmount({
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number
    })
    console.log("data :>> ", data)
    remainQuotaAmount.value = Number(data.remain_quota_amount ?? 0)
  }

  /** 加減款 */
  const handlerClickSubmit = async () => {
    if (!dialogAmount.value || Number(dialogAmount.value) <= 0) {
      $q.notify({
        type: "negative",
        message: t("common.validate.mustNotBeEmpty"),
        position: "top"
      })
      return
    }

    const params: Request.UpdateMemberAgentQuotaBalance = {
      member_account: targetAccount.value,
      type: dialogIncreaseItem.value === 0 ? dialogType.value : dialogType.value + 2,
      amount: dialogAmount.value,
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number
    }

    const { status } = await updateMemberAgentQuotaBalance(params)

    if (status) {
      $q.notify({
        type: "positive",
        message: t("report.success"),
        position: "top"
      })

      showDialog.value = false
      dialogIncreaseItem.value = 0
      handlerGetMemberAgentQuotaBalance()
      handlerGetMemberAgentQuotaAmount()
    }
  }

  const handlerGetMemberAgentQuotaBalance = async () => {
    manageRows.value = []
    if (!inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id) return
    const { data } = await getMemberAgentQuotaBalance({
      currency_id: inUseWallet.value?.[WALLET_TYPE.Enums.Cash].currency_id as number,
      size: String(size.value),
      offset: String(offset.value)
    })

    manageRows.value = data.list
    referralCode.value = data.referral_code
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  const handlerGetMemberAgentQuotaMoneyHistory = async () => {
    detailRows.value = []

    let startTime
    let endTime

    if (typeof dateRange.value === "string") {
      // 選同一天
      startTime = preciseDivide(new Date(dateRange.value).setHours(0, 0, 0), 1000)
      endTime = preciseDivide(new Date(dateRange.value).setHours(23, 59, 59), 1000)
    } else {
      // 選不同天
      startTime = preciseDivide(new Date(dateRange.value.from).setHours(0, 0, 0), 1000)
      endTime = preciseDivide(new Date(dateRange.value.to).setHours(23, 59, 59), 1000)
    }

    const params: Request.GetMemberAgentQuotaMoneyHistory = {
      member_account: memberAccount.value,
      str_time: startTime,
      end_time: endTime,
      search_type: changeType.value,
      size: String(size.value),
      offset: String(offset.value)
    }

    const data = (await getMemberAgentQuotaMoneyHistory(params)) as Response.GetMemberAgentQuotaMoneyHistoryList

    detailRows.value = data.list
    totalPage.value = Math.ceil(data.total / size.value)
    page.value = Math.floor(data.offset / data.size) + 1
    offset.value = (page.value - 1) * size.value
  }

  return {
    activeTab,
    menuRef,
    datePickerShow,
    referralCode,
    page,
    offset,
    size,
    totalPage,
    showDialog,
    remainQuotaAmount,
    dialogType,
    targetAccount,
    dialogAmount,
    dialogMemberIsAgent,
    dialogIncreaseItem,
    dialogIncreaseItemOptions,
    memberAccount,
    dateRange,
    formattedDateRange,
    formattedStartDate,
    formattedEndDate,
    changeType,
    manageRows,
    detailRows,
    changeTypeOptions,
    manageColumns,
    detailColumns,
    hideMenu,
    handlerChangeActiveTab,
    onInputChange,
    searchTypeName,
    parseDate,
    resetPage,
    handleChangePage,
    changeDetailActiveTab,
    handlerSearchAccountAmount,
    handlerClickOperation,
    handlerGetMemberAgentQuotaAmount,
    handlerClickSubmit,
    handlerGetMemberAgentQuotaBalance,
    handlerGetMemberAgentQuotaMoneyHistory
  }
}
