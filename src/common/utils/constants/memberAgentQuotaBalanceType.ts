export enum Enums {
  /** 加款 */
  Add = 1,

  /** 扣款 */
  Minus
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.Add]: "common.btn.addAmount",
  [Enums.Minus]: "common.btn.minusAmount"
}
