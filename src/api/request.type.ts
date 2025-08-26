/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  BANNER_POSITION,
  CMS_OPENING_METHOD,
  CMS_TYPE,
  GENDER,
  HISTORY_SEARCH_TYPE,
  INVITATION_STATUS,
  MY_REPORT_TARGET,
  KYC_TYPE,
  LOGIN_METHOD,
  PENDING_SEARCH_TYPE,
  REGISTER_METHOD,
  REPORT_DATE_TYPES,
  WALLET_TYPE,
  REBATE_STATUS,
  SMS_OTP_TYPE,
  LOGIN_PROVIDER
} from "src/common/utils/constants"
import { LocationQueryRaw } from "vue-router"
import NewReportTable from "app/template/set_r016/pages/HomePage/ShareholderPlatform/NewReportTable/Index.vue"

export interface RedirectPayload {
  did: string
  opening_method?: CMS_OPENING_METHOD.Enums
  query?: LocationQueryRaw
}

export interface GetOTP {
  phone_number: string
  country_code?: string
  request_type: SMS_OTP_TYPE.Enums
}

export interface login {
  login_method: LOGIN_METHOD.Enums
  username?: string
  password?: string
  phone?: string
  sms_otp?: string
  country?: string
}

export interface logout {}

export interface register {
  is_customize: boolean
  is_sub_ad?: boolean
  account?: string
  password?: string
  confirm_password?: string
  ref_account?: string
  invite_code?: string
  fullname?: string
  nickname?: string
  dob?: string
  gender?: number | null
  email?: string
  country?: string
  phone?: string
  gaming_site?: number | null
  customize_column?: {
    sns_account_1: string
    sns_account_2: string
    nationality: string
    place_of_birth: string
    present_address: string
    permanent_address: string
    nature_of_work: string
    source_of_income: string
  }
  [key: string]: any
}

export interface RegistInputCustom {
  type: string
  mode?: string
}

export interface RegisterSms {
  register_method: REGISTER_METHOD.Enums
  phone: string
  sms_otp: string
  country: string
}

export interface forgetPassword {
  account: string
  email: string
}

export interface forgetPasswordSms {
  phone: string
  sms_otp: string
  country_code?: string
}

export interface resetPassword {
  token: string
  account?: string
  password: string
  confirm_password: string
}

export interface CheckPhone {
  phone_number: string
}

//#region UserInfo
export interface UserInfo {
  single: boolean
  is_customize: boolean
  real_name: string
  nickname: string
  gender: GENDER.Enums
  date_of_birth: string
  contact: {
    contact1: string
    contact2: string
  }
  email: string
  img?: string
  self_exclusion_at?: number | null
  login_provider?: LOGIN_PROVIDER.Enums
}

export interface UserInfoForm {
  [key: string]: any
  account: string // 帳號
  ref_account: string // 推薦人
  fullname: string // 真實姓名
  nickname: string // 暱稱
  dob: string // 生日
  gender: GENDER.Enums // 性別
  country: string // 國碼
  phone: string // 電話
  email: string // 電子郵箱
  sns_account_1: string // 通訊軟體1
  sns_account_2: string // 通訊軟體2
  nationality: string // 國籍
  place_of_birth: string // 出生地
  present_address: string // 現居地址
  permanent_address: string // 永久地址
  nature_of_work: string // 工作性質
  source_of_income: string // 收入來源
  gaming_site: number // 遊戲場地
  sms_otp: string
  self_exclusion_at: number | null
  middle_name: string
  last_name: string
  city: string
  country_name: string
  region: string
  province: string
  area: string
  postal_code: string
  job_type_details: string
  income_source_details: string
  approval_status: boolean
  invite_code: string
}

export interface AccountInfoForm {
  [key: string]: any
  self_exclusion_at: number | null
}

export interface SetSingleAccountInfoForm {
  [key: string]: any
  single: boolean
  self_exclusion_at?: number | null
}

export interface SetUserInfo {
  [key: string]: any
  single: boolean
  is_customize: boolean
  fullname: string // 真實姓名
  nickname: string // 暱稱
  dob: string // 生日
  gender: GENDER.Enums // 性別
  country: string // 國碼
  phone: string // 電話
  email: string // 電子郵箱
  gaming_site: number // 遊戲場地
  sns_account_1: string // 通訊軟體1
  sns_account_2: string // 通訊軟體2
  nationality: string // 國籍
  place_of_birth: string // 出生地
  present_address: string // 現居地址
  permanent_address: string // 永久地址
  nature_of_work: string // 工作性質
  source_of_income: string // 收入來源
  self_exclusion_at?: number | null
  approval_status: boolean
}

export interface SetSingleUserInfo {
  single: boolean
  is_customize: boolean
  fullname?: string // 真實姓名
  nickname?: string // 暱稱
  dob?: string // 生日
  gender?: GENDER.Enums // 性別
  country?: string // 國碼
  phone?: string // 電話
  email?: string // 電子郵箱
  gaming_site?: number // 遊戲場地
  sns_account_1?: string // 通訊軟體1
  sns_account_2?: string // 通訊軟體2
  nationality?: string // 國籍
  place_of_birth?: string // 出生地
  present_address?: string // 現居地址
  permanent_address?: string // 永久地址
  nature_of_work?: string // 工作性質
  source_of_income?: string // 收入來源
  self_exclusion_at?: number | null
}

export interface UserAvatar {
  img: string
}

export interface Password {
  old_password: string
  new_password: string
  confirm_password: string
}

interface TgUser {
  id: number
  first_name: string
  last_name: string
  username: string
  language_code: string
  allows_write_to_pm: boolean
}

export interface TgWebAppLogin {
  serial_code: string
  user: TgUser
  chat_instance: string
  chat_type: string
  auth_date: string
  hash: string
  [key: string]: string | TgUser
}
//#endregion

//#region UserPreferences
export interface PutPreferencesExclusion {
  exclusion_at: number
}

export interface GetBetLimitListStatus {
  currency_id: number
  now_time: number
}

export interface GetBetLimitList {
  size: number
  offset: number
}

export interface GetBetLimitItem {
  id: string
  now_time: number
}

export interface PostBetLimitItem {
  begin_date: number
  end_date: number
  currency_id: number
  restrict_amount: number
}

export interface PutBetLimitItem {
  restriction_id: number
  setting_id: number
  currency_id: number
  now_date_time: number
  restrict_amount: number
}

export interface BetLimitForm {
  currency_id: number
  restrict_amount: string
  restriction_id: number
  setting_id: number
  now_date_time: number
  date_range: number[]
  last_restrict_amount: string
}
//#endregion

//#region Game
export interface ProductList {
  game_type: string
  currency?: string
}

export interface GameList {
  product_code?: number
  game_type?: string
  currency?: string
  member_id?: number
  is_favorited?: boolean
}

export interface LaunchGame {
  game_code: string
  game_type: string
  product_code: number
  platform: string
  currency: string
  language_code: number
}

export interface FavoriteGame {
  game_id: number
}
//#endregion

//#region bank
export interface GetBankCardList {
  currency_id?: string
  payment_type_id?: string
  // payment_gateway_id?: number
}

export interface GetPaymentTypeList {
  currency_id?: number
}

export interface GetBankCardInfo {
  id: number
}

export interface AddBankCard {
  id?: number
  payment_type_id: number
  payment_gateway_id?: number
  name?: string
  account_number?: string
  account_name?: string
  currency: string
  branch?: string
  bank_id?: number | string
  crypto_id?: number | string
  bank_name?: string
  wallet_address?: string
  currency_brand?: string
  chain?: string
  rate?: number
}

export interface EditBankCard {
  id: number
  payment_type_id: number
  payment_gateway_id?: number
  name?: string
  account_number?: string
  account_name?: string
  currency: string
  branch?: string
  bank_id?: number | string
  crypto_id?: number | string
  bank_name?: string
  wallet_address?: string
  currency_brand?: string
  chain?: string
}

export interface GetBankList {
  payment_gateway_id?: number
  payment_type_id?: number
}

export interface DepositExtraRemark {
  id: number
  type: number
  content: string
}

export interface Deposit {
  amount: string
  payment_gateway_id: number
  currency: string
  promotion_id: number
  [key: string]: any
  extra_remark: DepositExtraRemark[]
  images: string[]
}

export interface Withdraw {
  amount: string
  payment_gateway_id?: number | null
  payment_type_id: number
  currency: string
  id: number
  [key: string]: any
  bank_id: number
  remaining_turnover: string
  withdrawal_password: string
  balance: string
  crypto_rate?: string | number
  images: string[]
}

export interface WithdrawDetail {
  id: number
}

export interface WithdrawCryptoRate {
  currency: string
  crypto_id?: number | string
}

export interface WithdrawCrypto {
  currency: string
}

//#endregion

export interface MailList {
  size: number
  offset?: number
  page?: number
}

//#region chat room
export interface GetMemberSearch {
  account: string
}

export interface GetChatroomCecent {
  size?: string
  page?: string
}

export interface DeleteChatroomRelation {
  target_id: number
}

export interface GetChatroomInfo {
  target_id: number
}

export interface GetChatroomMessage {
  chat_room_id: string
  size: string
  before_ts?: number
  after_ts?: number
}

export interface PutChatroomMemberNickname {
  target_id: number
  nickname: string
}

export interface PostChatroomMessage {
  target_id: number
  message: string
}

export interface PostChatroomImage {
  target_id: number
  images: File[]
}

//#endregion

//#region rank
export interface GetRankList {
  currency_id?: number
  game_type?: number
}
//#endregion

//#region 邀請轉盤
export interface GetReferralWheelMemberInfo {
  referral_wheel_id: number
}

export interface PostReferralWheelSpin {
  currency_id: number
}

export interface GetReferralWheelMemberPrizes {
  referral_wheel_id: number
}
//#endregion

//#region report
export interface MoneyHistory {
  search_type: HISTORY_SEARCH_TYPE.Enums
  start_date: string
  end_date: string
  offset: number
  size: number
  dateType?: REPORT_DATE_TYPES.Enums
  wallet_types: WALLET_TYPE.Enums[]
  updated_by: number
  currency_id: number
}

export interface MoneyHistoryList {
  search_type: string[]
  start_date: string
  end_date: string
  offset: number
  size: number
  dateType?: REPORT_DATE_TYPES.Enums
  wallet_types: WALLET_TYPE.Enums[]
  updated_by?: string
  currency_id?: string
}

export interface MoneyHistoryTotal {
  start_date: string
  end_date: string
  offset?: number
  size?: number
  wallet_types?: WALLET_TYPE.Enums[]
  updated_by?: string
  currency_id: string
}

export interface MoneyPending {
  search_type: PENDING_SEARCH_TYPE.Enums
  start_date: string
  end_date: string
  offset: number
  size: number
  dateType?: REPORT_DATE_TYPES.Enums
}

export interface MoneyPendingCancel {
  order_type: string
  trans_code: string
}

//#endregion

export interface ReqBannerList {
  position: BANNER_POSITION.Enums
}

export interface ITrafficData {
  agent_code: string
}

export interface GetMiniGameAuthKey {
  currency_id: number
}

export interface PostLaunchMiniGame {
  currency_id: number
}

export interface KycV2Item {
  img: string
  type: KYC_TYPE.Enums
  correspondence: number
}

export interface KycV2Data {
  imgs?: KycV2Item[]
}

export interface KycData {
  imgs?: string[]
}

export type GetCmsList = {
  type: CMS_TYPE.Enums
}

export interface PostTotpVerify {
  passcode: string
}

export interface PostTotpEnable {
  passcode: string
}

export interface MayaLogin {
  session_id: string
}

interface MayaBaseType {
  currency?: string
  amount: string
}

export interface MayaDeposit extends MayaBaseType {
  promotion_id: number
}

export interface MayaWithdraw extends MayaBaseType {}

export interface ClaimGiftData {
  gift_id: number
  amount: number
  currency: number
}

// === 會員代理 ===
interface GetReferralSettingBase {
  size?: number
  offset?: number
}

export interface GetReferralSetting extends GetReferralSettingBase {}
export interface GetReferralStatementList extends GetReferralSettingBase {}
export interface GetReferralStatementDetail extends GetReferralSettingBase {}

export interface UpdateReferralSetting {
  member_id: number
  currency_limit: {
    [key: string]: number
  }
}

export interface PostTransferBonusWallet {
  amount: number
  currency_id?: number
}

//#region 網域管理

export interface GetDomainList {
  offset: number
  size: number
}

export interface AddDomain {
  title: string
  name: string
}
//#endregion

//#region 合營代理
export interface GetCollaborationStatistics {
  lang: string
  currency_id: number
}

export interface GetInvitationList {
  member_account: string
  currency_id: number
  status?: INVITATION_STATUS.Enums
  offset: number
  size: number
}

export interface GetInvitations {
  member_account: string
  currency_id: number
  status: INVITATION_STATUS.Enums
  offset: number
  size: number
}
export interface GetRebates {
  start_time: string
  end_time: string
  currency_id: number
  // status: REBATE_STATUS.Enums
  offset: number
  size: number
}
//#endregion

//#region 上級反佣
export interface getReferralRebateSummary {
  currency_id: number
}
export interface getReferralRebateStatements {
  currency_id: number
  account: string
  game_type: number
  offset: number
  size: number
}
export interface getReferralRebateEvents {
  currency_id: number
  start_time: string
  end_time: string
  offset: number
  size: number
}
export interface getReferralRebateEventsStatements {
  event_id: number
  account: string
  game_type: number
  currency_id: number
  offset: number
  size: number
}

export interface UploadDetailUpload {
  trans_code: string
  images: string[]
}

// ==== 股東盤 ====
// 取得昨日報表
export interface YesterdayReport {
  currency_id?: number
  start_time?: string
  end_time?: string
}

// 我的報表
export interface MyReport {
  currency_id?: number
  target?: MY_REPORT_TARGET.Enums
  start_time?: string
  end_time?: string
  offset?: number
  size?: number
}

// 我的報表 - 明細
export interface MyReportDetail {
  account?: string
  currency_id?: number
  entry_id: number
  offset?: number
  size?: number
}

// 取得時間區間團隊概覽
export interface TimeRangeTeamOverView {
  currency_id?: number
  start_time?: string
  end_time?: string
}

// 取得團隊概覽
export interface TeamOverView {
  currency_id?: number
}

// 取得最新一期
export interface ShareholderLatest {
  currency_id?: number
}
export interface ConditionType {
  // RTP 條件
  mode: string // 觸發模式：Greater(大於) / Less(小於) / Range(區間)
  value: string // Greater / Less 模式使用的單一閥值
  min: string // Range 模式下限
  max: string // Range 模式上限
  agent_bet_area_index: number // 觸發後下注的區域索引
  agent_bet_chip: string // 下著面額
}

export interface RuleType {
  required_count?: number
  bet_area_indices?: number[] // 0:莊, 1:閒
  agent_bet_area_index: number // 下注區域，0:莊, 1:閒
  agent_bet_chip: string // 下注面額
  conditions: ConditionType[]
}

export interface EnabledPatternList {
  product_name: string
  game_name: string
  pattern_type: string
  is_active: boolean
  rule: RuleType
}
export interface AgentConfigs {
  currency?: string
  balance?: string
  daily_stop_profit?: string
  daily_stop_loss?: string
  enabled_pattern_list?: EnabledPatternList[]
}

export interface PostLaunchAI {
  game_type: string
  product_code: number
  platform: string
  currency: string
  language_code: number
  /*
    action_type
    0: 取得投注設定(等於是 GET method 取得列表)
    1: 開始投注(選 1 時，data 必填, status 為 true)
    2: 更新設定資料(選 2 時，data 必填, status 為 false)
    3: 停止投注(選 3 時，data 必填, status 為 false)
  */
  action_type: number
  data?: {
    status: boolean // 是否正在投注
    agent_configs: AgentConfigs[]
  }
}

export interface GetMemberAgentQuotaBalance {
  currency_id: number
  size?: string
  offset?: string
}

export interface UpdateMemberAgentQuotaBalance {
  member_account: string
  currency_id: number
  type: number
  /*
    type
    1: 增加
    2: 扣款
  */
  amount: string
}

export interface GetMemberAgentQuotaMoneyHistory {
  member_account: string
  str_time: number
  end_time: number
  search_type?: number
  size?: string
  offset?: string
}

export interface GetMemberAgentQuotaAmount {
  currency_id: number
}
