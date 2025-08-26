import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"

//  各版型路由
export const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("app/template/set_r017/layout/Index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("app/template/set_r017/pages/Home.vue")
      },
      {
        path: "productLobby/:gameType",
        name: "ProductLobby",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/ProductLobby.vue")
      },
      {
        path: "gameLobby/:gameType/:productCode?",
        name: "GameLobby",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/GameLobby.vue")
      },
      {
        path: "/proxy",
        name: "Proxy",
        meta: {
          needAuth: true,
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/Proxy/Index.vue")
      },
      {
        path: "/collaboration",
        name: "Collaboration",
        meta: {
          needAuth: true
        },
        component: () => import("app/template/set_r017/pages/Collaboration/Index.vue")
      },
      {
        path: "/referral_rebate",
        name: "ReferralRebate",
        component: () => import("app/template/set_r017/pages/ReferralRebate/Index.vue"),
        children: [
          {
            path: "event/:id",
            name: "ReferralRebateEvent",
            component: () => import("app/template/set_r017/pages/ReferralRebate/Index.vue")
          }
        ]
      },
      {
        path: "/ai_agent",
        name: "AIAgent",
        meta: {
          needAuth: true,
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/AIAgent/Index.vue")
      }
    ]
  },
  {
    path: "/member",
    name: "MemberPage",
    component: () => import("app/template/set_r017/layout/Index.vue"),
    meta: {
      needAuth: true
    },
    children: [
      {
        path: "",
        name: "member",
        component: () => import("app/template/set_r017/pages/Member.vue")
      },
      {
        path: "history",
        name: "history",
        meta: {
          className: "p-0"
        },
        component: () => import("app/template/set_r017/pages/History.vue"),
        children: [
          {
            path: "all",
            name: "HistoryAll",
            component: () => import("app/template/set_r017/pages/History.vue")
          },
          {
            path: "member",
            name: "HistoryMember",
            component: () => import("app/template/set_r017/pages/History.vue")
          },
          {
            path: "ai",
            name: "HistoryAi",
            component: () => import("app/template/set_r017/pages/History.vue")
          }
        ]
      }
    ]
  }
] as RouteRecordRaw[]

// 各版型beforeEach
export const beforeEach: NavigationGuardWithThis<undefined> = function (to, from, next) {
  next()
}
