export enum Enums {
  /** 7天內 */
  LastSevenDays = 1,

  /** 14天內 */
  LastForuteenDays,

  /** 30天內 */
  LastThirtyDays,

  /** 自定日期 */
  CustomDate,

  /** 今天 */
  Today,

  /** 昨天 */
  Yesterday
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.LastSevenDays]: "common.btn.withinSevenDays",
  [Enums.LastForuteenDays]: "common.btn.withinFourteenDays",
  [Enums.LastThirtyDays]: "common.btn.withinThirtyDays",
  [Enums.CustomDate]: "common.btn.customDate",
  [Enums.Today]: "common.btn.today",
  [Enums.Yesterday]: "common.btn.yesterday"
}

export const SubtractDays: Record<Enums, number> = {
  [Enums.LastSevenDays]: -7,
  [Enums.LastForuteenDays]: -14,
  [Enums.LastThirtyDays]: -30,
  [Enums.CustomDate]: 0,
  [Enums.Today]: 0,
  [Enums.Yesterday]: 0
}
