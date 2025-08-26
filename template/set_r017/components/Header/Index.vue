<template>
  <div class="header" :class="{ fixed: !props.modelValue }">
    <div class="menu-toggle" :class="{ 'is-close': props.modelValue }">
      <img :src="svgIcon('menu-arrow')" alt="menu-arrow" @click="emit('update:modelValue', !props.modelValue)" />
    </div>

    <div class="header-center" :class="{ 'is-close': props.modelValue }">
      <img class="h5_logo" :src="getSquareLogo()" @click="$router.push('/')" />

      <WalletDropdown v-if="isLogin" />

      <div class="nav">
        <q-btn
          v-if="!isLogin"
          class="loginBtn"
          color="primary"
          @click="showLogin($q.platform.is.mobile ? true : false)"
        >
          {{ $t("common.btn.login") }}
        </q-btn>

        <q-btn v-if="!isLogin" class="registerBtn" color="primary" @click="showRegister">
          {{ $t("common.btn.register") }}
        </q-btn>

        <div v-if="!isMobile && isLogin" class="user-info">
          <q-btn flat fab-mini color="white" class="menuft" @click="$router.push({ name: 'memberInbox' })">
            <img :src="svgIcon('user')" />
            <q-menu v-model="menuShow" class="!bg-transparent">
              <q-list style="min-width: 200px" class="header-menu-list">
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'memberProfile' })">
                    <img class="home-title-icon" :src="svgIcon('account')" alt="" />
                    <p>{{ $t("menu.memberCenter") }}</p>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'MemberVip' })">
                    <img class="home-title-icon" :src="svgIcon('vip')" alt="" />
                    <p>{{ $t("menu.vip") }}</p>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'MemberDeposit' })">
                    <img class="home-title-icon" :src="svgIcon('deposit')" alt="" />
                    <p>{{ $t("menu.deposit") }}</p>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'MemberWithdrawal' })">
                    <img class="home-title-icon" :src="svgIcon('withdrawal')" alt="" />
                    <p>{{ $t("menu.withdrawal") }}</p>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'history' })">
                    <img class="home-title-icon" :src="svgIcon('history')" alt="" />
                    <p>{{ $t("menu.history") }}</p>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="router.push({ name: 'orders' })">
                    <img class="home-title-icon" :src="svgIcon('order')" alt="" />
                    <p>{{ $t("menu.order") }}</p>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="logout">
                    <img class="home-title-icon" :src="svgIcon('logout')" alt="" />
                    <p>{{ $t("menu.logout") }}</p>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn flat fab-mini color="white" class="menuft" @click="$router.push({ name: 'history' })">
            <img :src="svgIcon('history')" />
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useLogo } from "src/common/composables/useLogo"
import { useAuth } from "src/common/hooks/useAuth"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
// import SelectBox from 'src/common/components/SelectBox.vue';
import { useWindowSize } from "@vueuse/core"
import WalletDropdown from "./components/WalletDropdown.vue"

const eventbus = injectStrict(EventBusKey)
let menuShow = ref(false)
const { svgIcon } = useSiteImg()
const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue", "changeLogin"])
const { isLogin, handleLogout } = useAuth()
const { getSquareLogo } = useLogo()
const router = useRouter()
const { width } = useWindowSize()
let isMobile = ref(false)

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}

function showLogin(forcePasswordLogin = false) {
  eventbus.emit("openLogin", true, forcePasswordLogin)
}

function showRegister() {
  console.log("demo no register")
  // eventbus.emit("openRegister", true)
}

const handleOpenModal = () => {
  if (isLogin.value) {
    router.push({ name: "memberProfile" })
  } else {
    emit("changeLogin", true)
  }
}

watch(
  width,
  (newWidth) => {
    if (newWidth >= 576) {
      isMobile.value = false
    } else {
      isMobile.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.header {
  z-index: 1;
  width: 100%;
  height: 4.25rem;
  position: relative;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $secondary05;
  flex-direction: row;

  @include phone-width {
    height: 3.6875rem;
  }

  @include pad-width {
    position: relative;
    width: 100%;
    background: #0d0000;
  }

  &.fixed {
    @include phone-width {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  }

  .menu-toggle {
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    justify-content: flex-start;
    margin-left: 1.5rem;
    height: 100%;
    z-index: 999;
    transition: left 0.2s ease 0s;
    position: absolute;
    left: 0;

    @include phone-width {
      margin-left: 0.875rem;
    }

    img {
      transform: rotate(0deg);
      transition: transform 0.2s ease 0s;
      cursor: pointer;
    }

    &.is-close {
      img {
        transform: rotate(180deg);
      }
    }
  }

  .header-center {
    height: 100%;
    max-width: 75rem;
    flex: 1;
    display: flex;
    margin-left: 14.375rem;
    justify-content: space-between;
    align-items: center;
    transition: 0.2s ease 0s;

    @include phone-width {
      flex: 3;
      margin-left: 3.375rem;
    }

    &.is-close {
      margin-left: 3.4375rem;

      @include phone-width {
        margin-left: 3.375rem;
      }
    }

    .h5_logo {
      height: 3.75rem;

      :deep(.q-btn__content) {
        justify-content: flex-start;
      }

      @include phone-width {
        height: 2.125rem;

        margin-right: 5vw;
      }
    }

    .nav {
      color: #fff;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      @include phone-width {
        flex: 4;
        margin-right: 0;
      }
      .loginBtn {
        border-radius: 4px;
        border: 2px solid $primany01;
        color: $primany01 !important;
        background: transparent !important;
      }

      .registerBtn {
        border-radius: 4px;
        color: $neutral01 !important;
        background: $gradient01 !important;
        margin-left: 0.5rem;

        @include phone-width {
          margin-right: 0.875rem;
        }
      }

      .user-info {
        font-size: 18px;
        cursor: pointer;
        @include setFlex;
      }
    }
  }
}

.header-menu-list {
  @apply uppercase text-sm text-white;
  border-radius: 4px;
  background: $secondary01;
  padding: 0.5rem 0;

  .header-menu-separator {
    @apply bg-white/30;
  }

  :deep(.q-item) {
    padding: 8px 32px;

    .q-item__section {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;

      .home-title-icon {
        width: 1.2rem;
        margin-right: 10px;
      }

      p {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
