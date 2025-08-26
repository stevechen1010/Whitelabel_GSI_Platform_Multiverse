<template>
  <HeaderTitleBack title-i18n="menu.fundsDetails" variant="green-member">
    <div class="wallet-container">
      <span class="text-xs text-[#000000CC]">{{ $t("member.profile.totalBalances") }}</span>
      <div class="w-full flex justify-between px-3 py-2 items-center bg-[#F4F4F4] rounded-xl">
        <q-icon
          name="fa-solid fa-arrows-rotate"
          class="btn-refresh hide-hover p-0"
          :class="{ active: isLoading }"
          flat
          @click="getUserWalletList"
        />
        <span v-if="inUseWallet" class="balance text-bold text-md">
          <q-img :src="memberImg('money_icon.png')" class="w-4 h-4 mr-1" />
          {{ moneyFormat(inUseWallet[WALLET_TYPE.Enums.Cash].balance || "0", 2) }}
        </span>
      </div>
    </div>
    <div class="info-container">
      <!-- Deposit history -->
      <q-btn class="info-row" flat :to="{ name: 'history', query: { search_type: HISTORY_SEARCH_TYPE.Enums.Deposit } }">
        <span class="title">
          {{ $t(HISTORY_SEARCH_TYPE.FpI18nTitle[HISTORY_SEARCH_TYPE.Enums.Deposit]) }}
        </span>
        <q-icon name="navigate_next" class="icon-navigate"></q-icon>
      </q-btn>
      <q-separator />
      <!-- Withdrawal history -->
      <q-btn
        class="info-row"
        flat
        :to="{ name: 'history', query: { search_type: HISTORY_SEARCH_TYPE.Enums.Withdrawal } }"
      >
        <span class="title">
          {{ $t(HISTORY_SEARCH_TYPE.FpI18nTitle[HISTORY_SEARCH_TYPE.Enums.Withdrawal]) }}
        </span>
        <q-icon name="navigate_next" class="icon-navigate"></q-icon>
      </q-btn>
      <q-separator />
      <!-- Bet history -->
      <q-btn
        class="info-row"
        flat
        :to="{ name: 'history', query: { search_type: HISTORY_SEARCH_TYPE.Enums.BetHistory } }"
      >
        <span class="title">
          {{ $t(HISTORY_SEARCH_TYPE.I18nTitle[HISTORY_SEARCH_TYPE.Enums.BetHistory]) }}
        </span>
        <q-icon name="navigate_next" class="icon-navigate"></q-icon>
      </q-btn>
      <q-separator />
      <!-- Promotion history -->
      <q-btn
        class="info-row"
        flat
        :to="{ name: 'history', query: { search_type: HISTORY_SEARCH_TYPE.Enums.Promotion } }"
      >
        <span class="title">
          {{ $t(HISTORY_SEARCH_TYPE.I18nTitle[HISTORY_SEARCH_TYPE.Enums.Promotion]) }}
        </span>
        <q-icon name="navigate_next" class="icon-navigate"></q-icon>
      </q-btn>
      <q-separator />
      <q-btn class="info-row" flat :to="{ name: 'orders', query: { search_type: PENDING_SEARCH_TYPE.Enums.Deposit } }">
        <span class="title">
          {{ $t(PENDING_SEARCH_TYPE.FpI18nTitle[PENDING_SEARCH_TYPE.Enums.Deposit]) }}
        </span>
        <q-icon name="navigate_next" class="icon-navigate"></q-icon>
      </q-btn>
      <q-separator />
      <q-btn
        class="info-row"
        flat
        :to="{ name: 'orders', query: { search_type: PENDING_SEARCH_TYPE.Enums.Withdrawal } }"
      >
        <span class="title">
          {{ $t(PENDING_SEARCH_TYPE.FpI18nTitle[PENDING_SEARCH_TYPE.Enums.Withdrawal]) }}
        </span>
        <q-icon name="navigate_next" class="icon-navigate"></q-icon>
      </q-btn>
      <q-separator />
    </div>
  </HeaderTitleBack>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { HISTORY_SEARCH_TYPE, PENDING_SEARCH_TYPE, WALLET_TYPE } from "src/common/utils/constants"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
const { memberImg, svgIcon } = useSiteImg()
const router = useRouter()
const $q = useQuasar()
const { moneyFormat } = useCommon()
const { inUseWallet, getUserWalletList, isLoading } = useUserInfo()

onMounted(() => {
  if (!$q.platform.is.mobile) {
    router.push({ name: "memberProfile" })
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";
@import "app/template/okbet_green/assets/css/button.scss";

.wallet-container {
  margin-bottom: 1.25rem;
  padding-top: 1.25rem;

  @include phone-width {
    padding-top: 0.625rem;
  }

  .wallet-content {
    width: 91vw;
    aspect-ratio: 740/160;
    background-image: url("app/template/okbet_green/assets/images/member/fund-wallet-bg.png");
    background-repeat: no-repeat;
    background-size: contain;
    margin: 0 auto;
    padding-top: 1.875rem;
    padding-left: 2.5rem;
    line-height: 2.5rem;
    .wallet-title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row;
      font-size: 1.75rem;
      color: $text-light-tertiary;
      font-family: NotoSansTC;
      font-weight: 700;
    }
    .wallet-text {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row;
      font-weight: 700;
      font-size: 2.5rem;
      color: $text-light-tertiary;
      line-height: 4.25rem;
      font-family: NotoSansTC;
      .icon-money {
        font-size: 2.5rem;
      }
      .btn-refresh {
        &.active {
          animation: 0.3s linear 0s 1 normal forwards running reFreshAni;
        }
        :deep(.q-icon) {
          font-size: 2.1875rem;
        }
      }
    }
  }
  @include phone-width {
    background-color: #fff;
    border-radius: 10px;
    padding: 0.5rem 0.8rem;
    margin: 0.75rem;
    .btn-refresh {
      :deep(.q-icon) {
        font-size: 0.875rem;
      }
      &.active {
        animation: 0.3s linear 0s 1 normal forwards running reFreshAni;
      }
    }
  }
}

.info-container {
  margin-top: 10px;
  width: 100%;
  list-style: none;
  background: #fff;

  .info-row {
    padding-left: 5px;
    height: 6.25rem;
    width: 100%;
    :deep(.q-btn__content) {
      justify-content: space-between;
      .title {
        font-size: 1.75rem;
        line-height: 2.5rem;
        color: $text-light-secondary;
        padding-left: 1.25rem;
        text-transform: capitalize;
        font-weight: 400;
      }
      .q-icon {
        margin-right: 0.75rem;
        font-size: 2.5rem;
        color: $text-light-secondary;
        font-weight: 600;
      }
    }
    @include phone-width {
      height: 3.4375rem;
      :deep(.q-btn__content) {
        .title {
          font-size: 0.875rem;
          line-height: 1.25rem;
          padding-left: 0.625rem;
        }
        .q-icon {
          margin-right: 0.375rem;
          font-size: 1.5rem;
        }
      }
    }
  }
  .q-separator {
    margin-left: 1.75rem;
    margin-right: 1.75rem;
    height: 1px;
    background-color: $border-dark-secondary;

    &:last-child {
      display: none;
    }
    @include phone-width {
      margin-left: 0.875rem;
      margin-right: 0.875rem;
      height: 1px;
    }
  }
}
</style>
