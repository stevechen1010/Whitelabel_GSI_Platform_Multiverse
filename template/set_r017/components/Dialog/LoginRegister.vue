<template>
  <q-dialog v-model="modelValue" maximized>
    <q-card :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" class="login-card">
      <q-card-section class="card-right">
        <div class="title" v-if="!$q.platform.is.mobile">
          <h2>{{ $t("common.btn.login") }}</h2>
          <p>We'll send a code to your mobile number</p>
        </div>
        <div class="close-btn-container">
          <img v-if="$q.platform.is.mobile && getWideLogo()" :src="getWideLogo()" alt="" />
          <q-btn icon="close" class="hide-hover" flat round dense v-close-popup />
        </div>
        <!-- <div class="card-right-header">
          <img v-if="getWideLogo()" :src="getWideLogo()" alt="" />
        </div> -->
        <div class="card-right-form">
          <!-- <PhoneLoginRegisterForm :is-password-login-mode="isPasswordLoginMode" v-if="isPhoneRegisterMode" />
          <AccountLoginRegister v-else /> -->
          <ModeLoginRegister :type="modalType" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { useLogo } from "src/common/composables/useLogo"
import { useEnv } from "src/common/hooks/useEnv"
import { MODAL_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref } from "vue"
import ModeLoginRegister from "../Form/ModeLoginRegister.vue"

const $q = useQuasar()
const { getWideLogo } = useLogo()
const { isPhoneRegisterMode } = useEnv()
const eventbus = injectStrict(EventBusKey)

const isPasswordLoginMode = ref(false)
const modelValue = ref(false)
const slide = ref(1)
const modalType = ref(MODAL_TYPE.Enums.Login)

function closeDialog() {
  eventbus.emit("openLogin", false)
}

onMounted(async () => {
  eventbus.on("openLogin", (show: boolean, isPasswordLogin?: boolean) => {
    modelValue.value = show
    modalType.value = MODAL_TYPE.Enums.Login

    if (isPasswordLogin != null) isPasswordLoginMode.value = isPasswordLogin
  })

  eventbus.on("openRegister", (show: boolean) => {
    modelValue.value = show
    modalType.value = MODAL_TYPE.Enums.Register
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/button.scss";

.login-card {
  @include hideScrollBar;
  background-color: $secondary01;
  &.pc {
    border-radius: 1.25rem;
    min-width: 35rem;
    width: auto;
    height: 26rem;
    position: relative;
    display: flex;
    flex-direction: row;
    -webkit-box-pack: justify;
    justify-content: space-between;
    overflow: hidden;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: $secondary01;
    color: rgba($neutral01, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 1.875rem;
    max-height: calc(100% - 20px);
    max-width: 37.5rem;

    .card-left {
      padding: 0;
      width: 30rem;
      height: 41.25rem;
      :deep(.q-carousel) {
        width: 100%;
        height: 41.25rem;
        .q-carousel__slide {
          padding: 0;
          background-size: contain;
        }
        .q-carousel__control {
          bottom: 0.9375rem;
          .q-btn {
            padding: 0;
            margin: 0 0.25rem;
            opacity: 0.2;
            color: $neutral01;
            min-width: 0;
            min-height: 0;
            &.q-carousel__navigation-icon--active {
              opacity: 1;
              color: $neutral01;
            }
            .q-icon {
              font-size: 0.5rem;
              width: 0.5rem;
              min-width: 0.5rem;
            }
          }
        }
      }
    }
    .card-right {
      width: 100%;
      padding: 0rem 2.5rem 0.8125rem;
      overflow: hidden scroll;
      position: relative;
      .title {
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
      }
      .close-btn-container {
        position: absolute;
        width: auto;
        background-color: $secondary01;
        z-index: 2;
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        top: 0rem;
        left: 32rem;
        vertical-align: -0.15em;
        fill: currentcolor;
        overflow: hidden;
        pointer-events: auto;
        img {
          height: 5rem;
        }
        .title {
          text-align: center;
        }
        .q-btn {
          padding: 0;
        }
      }
      .card-right-header {
        margin: 1.25rem 0;
        position: sticky;
        top: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 5.625rem;
          aspect-ratio: auto 90 / 36;
        }
      }
      .card-right-form {
        color: rgba($neutral01, 0.87);
        margin-top: 20px;
      }
    }
  }
  &.h5 {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    background-size: cover;
    background-position: center top;
    overflow-x: hidden;
    .card-right {
      padding: 0 !important;
      @apply h-full w-full p-6 pb-0 mx-auto flex justify-start items-center flex-col;
      .close-btn-container {
        background: $secondary05;
        @apply w-full flex justify-between items-center p-3;
        margin-top: 1.875rem;
        img {
          width: 8rem;
        }
        .q-btn {
          background: $secondary05;
          color: $neutral01;
        }
      }
      .card-right-header {
        margin-top: 2rem;
        margin-bottom: 4rem;
        img {
          width: auto;
          height: 8.5rem;
        }
      }
      .card-right-form {
        padding: 1rem 0.75rem;
        width: 90%;
      }
      @include phone-width {
        @apply p-3;
        .close-btn-container {
          margin-top: 0rem;
          height: 70px;
        }
        .card-right-header {
          margin-top: 0rem;
          margin-bottom: 2.125rem;
          img {
            height: 4.375rem;
          }
        }
        .card-right-form {
          width: 100%;
        }
      }
    }
  }
}
</style>
