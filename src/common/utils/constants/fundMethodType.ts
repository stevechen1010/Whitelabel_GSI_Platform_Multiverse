export enum Enums {
  /** 銀行轉帳 */
  BankTransfer = 1,

  /** 電子錢包 */
  EWallet = 2,

  /** 虛擬貨幣錢包 - 銀行轉帳 */
  CryptoWallet = 3,

  /** 虛擬貨幣錢包 - 三方 */
  CryptoPayment = 7,

  /** ApplePay */
  ApplePay = 4,

  /** Paypal */
  PayPal = 5
}

/** 後端的 key */
export enum BackendKeysEnums {
  /** 銀行轉帳 */
  BankTransfer = "BankTransfer",

  /** 電子錢包 */
  EWallet = "EWallet",

  /** 虛擬貨幣錢包 */
  CryptoWallet = "CryptoWallet",

  /** 虛擬貨幣錢包 */
  CryptoPayment = "CryptoPayment",

  /** ApplePay */
  ApplePay = "ApplePay",

  /** Paypal */
  PayPal = "Paypal"
}

export const EnumsLabel: Record<Enums, string> = {
  [Enums.BankTransfer]: "BankTransfer",
  [Enums.EWallet]: "EWallet",
  [Enums.CryptoWallet]: "CryptoWallet",
  [Enums.CryptoPayment]: "CryptoPayment",
  [Enums.ApplePay]: "ApplePay",
  [Enums.PayPal]: "PayPal"
}

export const I18nKeys: Record<Enums, string> = {
  [Enums.BankTransfer]: "fund_method_type.money_transfer",
  [Enums.EWallet]: "fund_method_type.electronic_wallet",
  [Enums.CryptoWallet]: "fund_method_type.crypto_wallet",
  [Enums.CryptoPayment]: "fund_method_type.crypto_payment_wallet",
  [Enums.ApplePay]: "fund_method_type.apple_pay",
  [Enums.PayPal]: "fund_method_type.paypal"
}

export const iconClass: Record<Enums, string> = {
  [Enums.BankTransfer]: "fas fa-landmark",
  [Enums.EWallet]: "fas fa-wallet",
  [Enums.CryptoWallet]: "fab fa-bitcoin",
  [Enums.CryptoPayment]: "fab fa-bitcoin",
  [Enums.ApplePay]: "fa-brands fa-cc-apple-pay",
  [Enums.PayPal]: "fa-brands fa-paypal"
}
