<template>
  <template v-if="isLogin && inUseWallet">
    <div>
      <div class="index-al-name">{{ userInfo.username }}</div>
      <div class="index-al-amt">
        <div :class="{ 'opacity-40': isLoading }">{{ inUseWallet[WALLET_TYPE.Enums.Cash].balance }}</div>
        <q-btn
          @click="getUserWalletList"
          :loading="isLoading"
          size=".5rem"
          flat
          dense
          icon="fa-solid fa-arrows-rotate"
        />
      </div>
    </div>
  </template>
  <template v-else>
    <a @click="router.push({ name: 'Login' })" class="index-login-btn">{{ $t("common.btn.loginAndRegister") }}</a>
  </template>
</template>

<script setup>
import { useUserInfo } from "src/common/composables/useUserInfo"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useAuth } from "src/common/hooks/useAuth"
import { useRouter } from "vue-router"

const { isLogin } = useAuth()
const router = useRouter()
const { isLoading, userInfo, inUseWallet, getUserWalletList } = useUserInfo()
</script>

<style lang="scss" scoped>
@import "app/template/set_6M88/assets/css/_variable.scss";

.index-login-btn {
  @apply flex items-center justify-center font-bold rounded-[1.5625rem];
  background: #31ccec;
  height: 2.5rem;
  width: 40%;
  color: #000;
  font-size: 0.875rem;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    animation: shine 4s infinite;
  }
}

@keyframes shine {
  0% {
    left: -75%;
  }
  25% {
    left: 125%;
  }
  100% {
    left: 125%;
  }
}
</style>
