import type * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { requestApi } from "src/common/utils/request"

export const getUserInfo = () => {
  return requestApi<null, Response.UserInfo>("/v1/player/center/basic/info", null, {
    name: "getUserInfo",
    method: "get"
  })
}

export const getUserInfo2 = () => {
  return requestApi<null, Response.GetUserInfo>("/v1/player/center/basic/info/customize", null, {
    name: "getUserInfo2",
    method: "get"
  })
}

export const getAccountInfo = () => {
  return requestApi<null, Response.AccountInfo>("/v1/player/center/basic/info/customize", null, {
    name: "getAccountInfo",
    method: "get"
  })
}

export const setUserInfo = (data: Request.UserInfo) => {
  const formData = JSON.parse(JSON.stringify(data))
  formData.gender = Number(formData.gender)

  if (formData.img === "") {
    delete formData.img
  }

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setUserInfo",
    method: "put"
  })
}

export const setUserInfo2 = (data: Request.SetUserInfo) => {
  const formData = JSON.parse(JSON.stringify(data))
  formData.gender = Number(formData.gender)

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setUserInfo2",
    method: "put"
  })
}

export const setAccountInfo = (data: Request.AccountInfoForm) => {
  const formData = JSON.parse(JSON.stringify(data))
  formData.gender = Number(formData.gender)

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setAccountInfo",
    method: "put"
  })
}

export const setSingleUserInfo2 = (data: Request.SetSingleUserInfo) => {
  const formData = JSON.parse(JSON.stringify(data))

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setSingleUserInfo2",
    method: "put"
  })
}

export const setSingleAccountInfo = (data: Request.SetSingleAccountInfoForm) => {
  const formData = JSON.parse(JSON.stringify(data))

  return requestApi<Request.UserInfo, null>("/v1/player/center/basic/info", formData, {
    name: "setSingleAccountInfo",
    method: "put"
  })
}

export const setUserAvatar = (data: Request.UserAvatar) => {
  return requestApi<Request.UserAvatar, null>("/v1/player/center/upload/head_shot", data, {
    name: "setUserAvatar",
    method: "post"
  })
}

export const setUserPassword = (data: Request.Password) => {
  return requestApi<Request.Password, null>("/v1/player/center/password", data, {
    name: "setUserPassword",
    method: "put"
  })
}

export const getUserBetHistoryTotal = () => {
  return requestApi<null, Response.GetUserBetHistoryTotal>("/v1/player/center/bet/history/total", null, {
    name: "getUserBetHistoryTotal",
    method: "get"
  })
}

export const setUserWithdrawalPassword = (data: Request.Password) => {
  return requestApi<Request.Password, null>("/v1/player/center/withdrawal_password", data, {
    name: "setUserWithdrawalPassword",
    method: "put"
  })
}

export const getUserWalletList = () => {
  return requestApi<null, Response.UserWalletList>("/v1/player/center/wallets", null, {
    name: "getUserWalletList",
    method: "get"
  })
}

export const setUserActiveWallet = (id: number) => {
  return requestApi<null, null>(`/v1/player/center/wallets/use/${id}`, null, {
    name: "setUserActiveWallet",
    method: "put"
  })
}

export const getLevelsInfo = () => {
  return requestApi<null, Response.UserLevelsInfo>("/v1/player/levels/list", null, {
    name: "getLevelsInfo",
    method: "get"
  })
}

export const getUserRemark = () => {
  return requestApi<null, Response.UserRemark>("/v1/player/center/remark", null, {
    name: "getUserRemark",
    method: "get"
  })
}

export const setUserKyc = (data: Request.KycData) => {
  return requestApi<Request.KycData, null>("/v1/player/center/kyc/upload", data, {
    name: "setUserKyc",
    method: "post"
  })
}

export const getMemberColumn = () => {
  return requestApi<{ type: string }, Response.MemberColumnList>(
    "/v1/player/user/customize_column/list",
    { type: "center" },
    {
      name: "getMemberColumn",
      method: "get"
    }
  )
}

//#region kyc

export const setUserKycV2 = (data: Request.KycV2Data) => {
  return requestApi<Request.KycV2Data, null>("/v1/player/center/kyc", data, {
    name: "setUserKycV2",
    method: "post"
  })
}
export const setUserKycV2Onboarding = (data: Request.KycV2Data) => {
  return requestApi<Request.KycV2Data, null>("/v1/player/auth/onboarding/kyc", data, {
    name: "setUserKycV2Onboarding",
    method: "post"
  })
}

export const updateUserKycV2 = (data: Request.KycV2Data) => {
  return requestApi<Request.KycV2Data, null>("/v1/player/center/kyc", data, {
    name: "updateUserKycV2",
    method: "put"
  })
}
export const updateUserKycV2Onboarding = (data: Request.KycV2Data) => {
  return requestApi<Request.KycV2Data, null>("/v1/player/auth/onboarding/kyc", data, {
    name: "updateUserKycV2Onboarding",
    method: "put"
  })
}

export const getUserKycV2 = () => {
  return requestApi<null, Response.UserKycList>("/v1/player/center/kyc", null, {
    name: "getUserKycV2",
    method: "get"
  })
}

export const getUserKycV2Onboarding = () => {
  return requestApi<null, Response.UserKycList>("/v1/player/auth/onboarding/kyc", null, {
    name: "getUserKycV2Onboarding",
    method: "get"
  })
}

export const getKycStatus = () => {
  return requestApi<null, Response.GetKYCStatus>("/platform/v1/player/auth/kyc/status", null, {
    name: "getKycStatus",
    method: "get"
  })
}

export const getKycStatusOnboarding = () => {
  return requestApi<null, Response.GetKYCStatus>("/platform/v1/player/auth/onboarding/kyc/status", null, {
    name: "getKycStatusOnboarding",
    method: "get"
  })
}

//#endregion

export const getMemberAgentQuotaBalance = (data: Request.GetMemberAgentQuotaBalance) => {
  return requestApi<Request.GetMemberAgentQuotaBalance, Response.GetMemberAgentQuotaBalanceList>(
    "/v1/player/center/member_agent_quota/balance",
    data,
    {
      name: "getMemberAgentQuotaBalance",
      method: "get"
    }
  )
}

export const updateMemberAgentQuotaBalance = (data: Request.UpdateMemberAgentQuotaBalance) => {
  return requestApi<Request.UpdateMemberAgentQuotaBalance, null>("/v1/player/center/member_agent_quota/balance", data, {
    name: "updateMemberAgentQuotaBalance",
    method: "post"
  })
}

export const getMemberAgentQuotaMoneyHistory = (data: Request.GetMemberAgentQuotaMoneyHistory) => {
  return requestApi<Request.GetMemberAgentQuotaMoneyHistory, Response.GetMemberAgentQuotaMoneyHistoryList>(
    "/v1/player/center/member_agent_quota/money_history",
    data,
    {
      name: "getMemberAgentQuotaMoneyHistory",
      method: "get"
    }
  )
}

export const getMemberAgentQuotaAmount = (data: Request.GetMemberAgentQuotaAmount) => {
  return requestApi<Request.GetMemberAgentQuotaAmount, Response.GetMemberAgentQuotaAmount>(
    "/v1/player/center/member_agent_quota/quota",
    data,
    {
      name: "getMemberAgentQuotaAmount",
      method: "get"
    }
  )
}

export const postTransferBonusWallet = (params: Request.PostTransferBonusWallet) => {
  return requestApi<Request.PostTransferBonusWallet, null>("/v1/player/wallet/transfer/bonus", params, {
    name: "postTransferBonusWallet",
    method: "post"
  })
}
