import { boot } from "quasar/wrappers"
import { createI18n, Composer } from "vue-i18n"

// 擴展 globalThis 型別
declare global {
  // eslint-disable-next-line no-var
  var $t: Composer["t"]
  // eslint-disable-next-line no-var
  var $te: Composer["te"]
  // eslint-disable-next-line no-var
  var $d: Composer["d"]
  // eslint-disable-next-line no-var
  var $n: Composer["n"]
}

import en from "src/i18n/locales/en"
import bn from "src/i18n/locales/Bengali"
import zhCN from "src/i18n/locales/zh-cn"
import zhTW from "src/i18n/locales/zh-tw"
import jp from "src/i18n/locales/jp"
import th from "src/i18n/locales/th"
import vi from "src/i18n/locales/vi"
import ko from "src/i18n/locales/ko"
import sp from "src/i18n/locales/Spanish"
import br from "src/i18n/locales/Brazil"
import id from "src/i18n/locales/id-in"
import bm from "src/i18n/locales/Bahasa Melayu"
import ar from "src/i18n/locales/Arabic"

const messages: any = {
  en,
  bn,
  "zh-cn": zhCN,
  "zh-tw": zhTW,
  jp,
  th,
  vi,
  ko,
  sp, //西班牙語
  br, //巴西
  id, //印尼
  bm, //馬來文 Bahasa Melayu
  ar //阿拉伯文 Arabic
  // other locales...
}

export type MessageLanguages = keyof typeof messages
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)["en"]

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module "vue-i18n" {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

export default boot(({ app }) => {
  const i18n = createI18n({
    locale: "en",
    legacy: false,
    messages,
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    globalInjection: true,
    fallbackLocale: "en" // fallback to 'en' if locale isn't found in the list
  })

  app.use(i18n)

  // 掛載全局 i18n functions
  globalThis.$t = (i18n.global as Composer).t
  globalThis.$te = (i18n.global as Composer).te
  globalThis.$d = (i18n.global as Composer).d
  globalThis.$n = (i18n.global as Composer).n
})
