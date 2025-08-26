<template>
  <div v-if="isReady" class="home-page">
    <BackgroundAnimation />
    <HeaderArea v-model="isAsideShow"></HeaderArea>
    <div class="layout-main wide" id="layout-main">
      <div class="aside-layout">
        <Transition>
          <AsideMenu v-model="isAsideShow" />
        </Transition>
      </div>
      <div class="hm-content" :class="{ isClose: isAsideShow }">
        <div class="inner-content scroll" ref="scrollRef">
          <div class="page-layout" :class="`${String(route.name)} ${route.meta.className}`">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </div>
        </div>
      </div>
    </div>
    <AIHelperIcon />
    <AIAgent v-draggable />
    <FloatIconCMS />
    <GS1MiniGame />
  </div>
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <!-- <LiveChat /> -->
  <BetDetailDialog />
  <LoginRegisterDialog />
  <SlideVerify />
</template>

<script lang="ts" setup>
import BetDetailDialog from "app/template/set_r017/components/Dialog/BetDetail.vue"
import LoginRegisterDialog from "app/template/set_r017/components/Dialog/LoginRegister.vue"
import { useSiteRedirect } from "app/template/set_r017/composables/useSiteRedirect"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useQuasar } from "quasar"
import SlideVerify from "src/common/components/modal/SlideVerify.vue"
import { useBank } from "src/common/composables/useBank"
import { useGame } from "src/common/composables/useGame"
import { useInit } from "src/common/composables/useInit"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useEnv } from "src/common/hooks/useEnv"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

import BackgroundAnimation from "app/template/set_r017/components/BackgroundAnimation/Index.vue"
import HeaderArea from "app/template/set_r017/components/Header/Index.vue"
import AsideMenu from "app/template/set_r017/layout/AsideMenu.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import AIHelperIcon from "app/template/set_r017/components/AI/Helper.vue"
import AIAgent from "app/template/set_r017/components/AI/Agent.vue"
import FloatIconCMS from "app/template/set_r017/components/FloatIconCMS/Index.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"

const { isReady, initialize } = useInit()
const { getTitle, visitWebsite } = useEnv()
const { getAgentSetting } = useLanguage()
const { getUserInfo2, getUserWalletList } = useUserInfo()
const { initGameTypeList } = useGame()
const { handleLogoList } = useLogo()
const { getAvailCurrencyList } = useBank()
const { handleSiteRedirect } = useSiteRedirect()
const { getGiftsList } = useClaimGift()
const { svgIcon } = useSiteImg()

const $q = useQuasar()
let isAsideShow = ref($q.platform.is.mobile)
const route = useRoute()

onMounted(() => {
  initialize({
    task: [
      visitWebsite,
      getTitle,
      getAgentSetting,
      handleLogoList,
      initGameTypeList,
      getUserInfo2,
      getUserWalletList,
      getAvailCurrencyList,
      getGiftsList
    ],
    siteRedirect: handleSiteRedirect
  })
})
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "src/css/modal.sass"
@import "app/template/set_r017/assets/css/_variable.scss"

// fadeIn
.v-enter-active,
.v-leave-active
  transition: opacity 0.3s ease

.v-enter-from,
.v-leave-to
  opacity: 0

// modal slot
.form-item
  margin: 10px 0
  p
    margin-bottom: 5px
    color: rgba($neutral01, 0.70)
    font-family: "Century Gothic"
    font-size: 14px
    font-style: normal
    font-weight: 700
    line-height: normal
    text-transform: capitalize

// layout style
.home-page
  position: relative
  // background-image: url('app/template/set_r017/assets/images/bg.jpg')
  margin: 0
  padding: 0
  height: 100%
  background-color: #0A0A35
  overflow: hidden
  // baground-size: 100% 100%
  // background-repeat: no-repeat
.btn-common
  margin: 0vw
  img
    width: 1.2vw
    +iphone-width
      width: 3vw
#slide_right
  +setFlex
  bottom: 208px
  width: 68px
  height: 56px
  border-radius: 50% 0px 0px 50%
  backdrop-filter: blur(10px)
  background: rgba($secondary01, 0.7)
  border: 1px solid $secondary01
  box-shadow: rgba($secondary01, 0.05) 0px 4px 8px 0px
  position: fixed
  top: 15vw
  right: 0vw
  z-index: 9
  +iphone-width
    top: unset
    bottom: 25vw
    backdrop-filter: none
    box-shadow: rgba($secondary01, 0.4) 0px 2px 10px
    width: 40px
    height: 40px
  img
    width: 3rem
    margin-right: 0.5rem
    cursor: pointer
.footer-wrapper
  width: 100%
  background: $secondary01
  padding: 0 2.875rem
  padding-top: 1vw
  padding-bottom: 1vw
  +setFlex
  .footer_left
    width: 20%
    margin: 0 2vw
    .logo-row
      display: flex
      align-items: center
      justify-content: center
      margin-bottom: 2px
      .logo
        width: 45%
      .small-img
        margin-left: 0.5vw
        width: 14%
    .contact-us
      color: $secondary01
      font-size: 1vw
      justify-content: center
      display: flex
      font-weight: bolder
    .contact-info
      display: flex
      align-items: center
      margin-top: 0.8vw
      color: $neutral01
      font-size: 0.8vw
      padding-left: 1.5vw
      opacity: 0.7
      .icon
        margin-right: 10px
    .social-media
      display: flex
      justify-content: center
      gap: 1.2vw
      margin-bottom: 1vw
      margin-top:0.8vw
      .social-icon
        width: 15%
    .footer-text
      color: $neutral01
      font-size: 0.8vw
      text-align: center
      margin-top: 1vw


  .footer_right
    width: 55vw
    margin: 0 0 0 2vw
    font-size: 0.9vw
    .footer-top
      flex-direction: row
      flex-wrap: wrap
      display: flex
      color: $neutral01
      .payment-methods
        flex-direction: row
        order: 0
        display: flex
        align-items: center
        align-self: flex-start
        margin-bottom: 0.6vw
        justify-content: flex-start
        width: 90%
        padding-top:1vw
        .title
          margin-right: 16px
          margin-bottom: 0
          display: flex
          justify-content: center
        .methods
          display: flex
          flex-wrap: wrap
          justify-content: space-around
          gap: 10px
          align-items: center
      .navigation-menu
        border-radius: 5px
        display: flex
        flex-wrap: wrap
        align-items: center
        justify-content: start
        line-height: 24px
        margin-bottom: 8px
        .q-size
          font-size: 1vw
          padding: 0.3vw
        .link-seperator
          height: 25px
          margin: 0px 5px
    .footer-bottom
      color: $neutral01
      .footer-content-bottom
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        width: 100%
        .be-support-content
          display: flex
          color: $neutral01
          font-size: 1.1vw
          .support_pc
            display: block
          .support_m
            display: none
          #footer-responsible-gaming
            text-decoration: underline
            cursor: context-menu
      .terms-info
        padding-top: 2vw
  +pad-width
    .q-size
      font-size: 0.9vw
      padding: 0
  +phone-width
    padding: 5% 8% 30%
    margin-top: 5vw
    height: auto
    flex-direction: column
    position: relative
    .footer_left
      margin: 0 0
      width: 100%
      .logo-row
        .logo
          width: 55%
        .small-img
          display: none
      .contact-us
        font-size: 6.2vw
        margin-top: -10vw
      .contact-info
        margin-top: 3vw
        margin-bottom: 1.5vw
        font-size: 3.8vw
        padding-left: 20.5vw
      .social-media
        margin-top: 6vw
      .footer-text
        font-size: 3.8vw
        margin-top: 4vw

    .footer_right
      margin: 4vw 0
      width: 100%
      font-size: 3.8vw
      .footer-top
        .navigation-menu
          display: none
        .payment-methods
          flex-direction: column
          .title
            margin-right:0px
            margin-bottom: 2vw
      .footer-bottom
        margin-top: 5vw
        .footer-content-bottom
          display: block
          .be-support-content
            font-size: 4.1vw
            display: block
            text-align: center
            .support_pc
              display: none
            .support_m
              display: block
        .terms-info
          text-align: center
          padding-top: 10vw
//H5 底下MENU BAR
.m-footer-bottom
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 99
  +phone-width
    display: block
  .menu-btm
    position: fixed
    margin: auto
    width: 100%
    height: 18vw
    bottom: 0
    left: 0
    right: 0
    background: url('../../assets/images/footer/ftr-menu-bar.png') no-repeat top center
    background-size: 100%
  .aff-qr
    background: $secondary01
    padding: 3.5%
    width: 13%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 28px
    margin: auto
    z-index: 9
    img
      opacity: 0.7
      filter: brightness(255) invert(1)
  .menu-wrapper
    display: grid
    grid-template-columns: repeat(5,1fr)
    text-align: center
    padding: 11px 0 1px
    position: relative
    .menuft
      color: $neutral01
      font-size: 2.5vw
      text-transform: uppercase
      font-weight: 600
      padding: 0 0
      :deep(.q-btn__content)
        display: block
      :deep(.q-focus-helper)
        opacity: 0
      img
        max-width: 31%
        display: block
        margin: auto auto 2px

      &.active
        overflow: hidden
        img
          position: relative
          left: -100px
          filter: drop-shadow(100px 0px 0px $secondary01)

// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
.btn-title
  color: rgba($neutral01, 0.70)
  font-family: "Century Gothic"
  font-size: 1.2vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
.btn-content
  color: rgba($neutral01, 0.70)
  font-family: "Century Gothic"
  font-size: 0.8vw
  font-style: normal
  font-weight: 700
  line-height: normal
  text-transform: uppercase
  &.yellow
    color: $yellow-active
// layout style
.layout-main
  position: relative
  height: calc(100vh - 4.25rem)
  overflow: hidden
  +phone-width
    height: calc(100vh - 3.6875rem)
  .hm-content
    width: calc(100% - 230px)
    margin-left: 230px
    height: 100%
    position: relative
    display: table
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    transition: width 0.2s ease 0s
    transition: margin-left 0.2s ease 0s
    +phone-width
      margin-left: 0px
      width: 100%
    &.isClose
      width: calc(100% - 60px)
      margin-left: 60px
      +phone-width
        width: 100%
        margin-left: 0px
    .inner-content
      width: 100%
      height: 100%
      overflow-y: auto
      &::-webkit-scrollbar
        display: none
      &.mobile
      .page-layout
        padding: 2.375rem 0 0
        position: relative
        margin: 0 auto
        +iphone-width
          padding: 0.8125rem 0 0
        &.p-0
          padding: 0
        &.PrivacyPolicy, &.TermAndCondition, &.ResponsibleGaming, &.without-padding
          padding: 0
          +phone-width
            padding: 0
      +iphone-width
        // width: 90vw
        margin: 0 auto
        .page-layout
          padding-bottom: 0
.reset-btn
  text-transform: none
  margin: 0 .3125rem
  color: $neutral01
  text-decoration-line:important
.btn-live-chat
  @apply flex justify-center items-center fixed z-30 transform-none
  width: 2.25rem
  height: 2.25rem
  bottom: 4.75rem
  right: .375rem
  font-weight: 580
  font-size: 1.25rem
  background-size: 100% 100%
  background-color: $secondary05
  box-shadow: rgba($secondary05, 0.4) 0px 2px 10px
  color: $neutral01
  border-radius: 50%
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) , visibility 0.3s ease
  &.tg-mini-app
    bottom: 5.75rem
  &.hide
    transform: translateY(112px)
    visibility: hidden
</style>
