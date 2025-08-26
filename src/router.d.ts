import { RouteLocationNormalized } from "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /** 此頁面是否需要登入後才能造訪 */
    needAuth?: boolean

    /** 若未登入，則將使用者踢回的 route (未設定則預設踢回 HomePage) */
    goRouteIfNoToken?: string

    /** okbet 控制外層homePage/index page-layout */
    className?: string
  }
}
