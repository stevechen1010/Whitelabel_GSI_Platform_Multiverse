import type { RouteRecordRaw, NavigationGuardWithThis } from "vue-router"

const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/common/pages/Error404.vue")
  },
  {
    path: "/Maintenance",
    component: () => import("src/common/pages/Maintenance.vue")
  },
  {
    path: "/windowClose",
    component: () => import("src/common/pages/WindowClose.vue")
  }
]

// export default routes

export default async function (siteKey?: string) {
  let routes: RouteRecordRaw[] = []
  let beforeEach: NavigationGuardWithThis<undefined> | null
  // 取得環境變數檔裡的siteKey
  if ((process.env.NODE_ENV === "development" || process.env.VITE_APP_BUILD_MODE === "all") && siteKey) {
    const module = await import(`../../template/${siteKey}/router/routes.ts`)

    routes = module.routes ? module.routes : []
    beforeEach = module.beforeEach ? module.beforeEach : ""
  } else {
    const module = await import("./build")
    routes = module.routes ? module.routes : []
    beforeEach = module.beforeEach ? module.beforeEach : null
  }
  const allRoutes = routes.concat(baseRoutes)
  return { routes: allRoutes, beforeEach }
}
