<template>
  <div v-if="$q.platform.is.mobile" class="profile-h5">
    <!-- <div class="info-header">
      <q-btn flat @click="handleOpenLiveChat">
        <i class="icon-service"></i>
      </q-btn>
      <q-btn flat :to="{ name: 'memberInbox' }">
        <i class="icon-mail"></i>
      </q-btn>
    </div> -->
    <div class="info-container">
      <div class="flex items-center">
        <Avatar />
        <div class="flex flex-col">
          <div class="info-content" @click="router.push({ name: 'memberProfileDetail' })">
            <div class="flex">
              <h3>{{ userInfo2.nickname || userInfo2.fullname }}</h3>
              <div>
                <q-btn class="mobile-kyc-btn" rounded flat :to="{ name: 'MemberKyc' }">
                  <template v-if="userInfo2.approval_status">
                    <img :src="commonResult('kyc/v2_approved.png')" />
                    KYC {{ $t("member.kyc.status_success") }}
                  </template>
                  <template v-else>
                    <img :src="commonResult('kyc/v2_rejected.png')" />
                    KYC {{ $t("member.kyc.status_unverified") }}
                  </template>
                </q-btn>
              </div>
            </div>
            <p>{{ $t("member.register.username") }}: {{ userInfo2.account }}</p>
          </div>
        </div>
      </div>
      <q-btn flat icon="arrow_forward_ios" :to="{ name: 'memberProfileDetail' }" class="btn-profile-detail"></q-btn>
    </div>
    <div class="scroll-container">
      <div class="vip_container">
        <div class="vip_content">
          <div class="vip_content_title flex justify-between items-center mb-3">
            <div>
              <span class="text-bold text-black rounded-3xl bg-[#82FF9D] px-3 py-1">{{ currentVip?.title }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-[#1FAB3D] text-bold">VIP{{ $t("common.club") }}</span>
              <q-btn flat icon="arrow_forward_ios" :to="{ name: 'MemberVip' }" class="btn-vip"></q-btn>
            </div>
          </div>
          <div class="vip_content_list">
            <!-- 單幣別 -->
            <div v-if="nextVipData?.conditions.length === 1" class="single-progress-container">
              <!-- bet -->
              <div
                v-if="
                  nextVipData?.promotion_condition === PROMOTION_CONDITION.Enums.BET ||
                  nextVipData?.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT
                "
                class="single-progress-content"
              >
                <VipProgress
                  :currencyCode="getCurrencyCode(nextVipData.conditions[0]?.currency_id)"
                  :numerator="userMultiStatisticsMap[nextVipData.conditions[0]?.currency_id]?.total_valid_bet_amount"
                  :denominator="nextVipData.conditions[0]?.valid_bet_amount"
                  :isLast="isLast"
                  :progressType="$t('vip.bet')"
                />
              </div>
              <!-- deposit -->
              <div
                v-if="
                  nextVipData?.promotion_condition === PROMOTION_CONDITION.Enums.DEPOSIT ||
                  nextVipData?.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT
                "
                class="single-progress-content"
              >
                <VipProgress
                  :currencyCode="getCurrencyCode(nextVipData.conditions[0]?.currency_id)"
                  :numerator="userMultiStatisticsMap[nextVipData.conditions[0]?.currency_id]?.total_deposit"
                  :denominator="nextVipData.conditions[0]?.deposit_amount"
                  :isLast="isLast"
                  :progressType="$t('common.btn.cash_in')"
                />
              </div>
            </div>
            <!-- 多幣別 -->
            <div v-else class="multi-progress-container">
              <!-- 多條件 -->
              <div
                v-if="nextVipData?.promotion_condition === PROMOTION_CONDITION.Enums.BET_AND_DEPOSIT"
                class="multi-condition"
              >
                <div>
                  <div class="progress-content">
                    <VipProgress
                      v-for="condition in nextVipData.conditions"
                      :key="condition.currency_id"
                      :currencyCode="getCurrencyCode(condition.currency_id)"
                      :numerator="userMultiStatisticsMap[condition.currency_id]?.total_valid_bet_amount"
                      :denominator="condition.valid_bet_amount"
                      :isLast="isLast"
                      :progressType="$t('vip.bet')"
                    />
                  </div>
                </div>
                <div>
                  <div class="progress-content">
                    <VipProgress
                      v-for="condition in nextVipData.conditions"
                      :key="condition.currency_id"
                      :currencyCode="getCurrencyCode(condition.currency_id)"
                      :numerator="userMultiStatisticsMap[condition.currency_id]?.total_deposit"
                      :denominator="condition.deposit_amount"
                      :isLast="isLast"
                      :progressType="$t('common.btn.cash_in')"
                    />
                  </div>
                </div>
              </div>
              <!-- 單條件 -->
              <div v-else class="single-condition">
                <template v-if="nextVipData?.promotion_condition === PROMOTION_CONDITION.Enums.BET">
                  <div class="progress-content">
                    <VipProgress
                      v-for="condition in nextVipData.conditions"
                      :key="condition.currency_id"
                      :currencyCode="getCurrencyCode(condition.currency_id)"
                      :numerator="userMultiStatisticsMap[condition.currency_id]?.total_valid_bet_amount"
                      :denominator="condition.valid_bet_amount"
                      :isLast="isLast"
                      :progressType="$t('vip.bet')"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="progress-content">
                    <VipProgress
                      v-for="condition in nextVipData?.conditions"
                      :key="condition.currency_id"
                      :currencyCode="getCurrencyCode(condition.currency_id)"
                      :numerator="userMultiStatisticsMap[condition.currency_id]?.total_deposit"
                      :denominator="condition.deposit_amount"
                      :isLast="isLast"
                      :progressType="$t('common.btn.cash_in')"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        <div class="flex justify-between items-center mt-5 gap-3">
          <div
            @click="handleRedirectDeposit"
            class="wallet-body-content flex items-center flex-1 h-11 overflow-visible rounded-full text-[#0CC763] border-2 border-[#0CC763] px-2"
          >
            <img class="w-[58px] h-[58px] mt-[-24px] mr-1" :src="memberImg('cash_in.gif')" />
            <div>
              <p class="title text-xl">{{ $t("common.btn.cash_in") }}</p>
            </div>
          </div>
          <div
            @click="handleRedirectWithdrawal"
            class="wallet-body-content flex items-center flex-1 h-11 overflow-visible rounded-full text-white bg-[#0CC763] px-2"
          >
            <img class="w-[58px] h-[58px] mt-[-24px] mr-1" :src="memberImg('withdrawal.gif')" />
            <div>
              <p class="title text-xl">{{ $t("menu.withdrawal") }}</p>
            </div>
          </div>
        </div>
        <div class="menu-list">
          <!-- password -->
          <q-btn class="menu-item" flat :to="{ name: 'memberChangePassword' }" v-if="!isMayaLogin">
            <q-icon class="icon-first">
              <img :src="svgIcon('key')" />
            </q-icon>
            <div class="menu-content">
              <div>{{ $t("member.profile.loginPassword") }}</div>
            </div>
          </q-btn>
          <!-- withdrawal password -->
          <q-btn class="menu-item" flat :to="{ name: 'memberChangeWithdrawalPassword' }" v-if="showWithdrawalPassword">
            <q-icon class="icon-first">
              <img :src="svgIcon('key')" />
            </q-icon>
            <div class="menu-content">
              <div>{{ $t("member.profile.withdrawPassword") }}</div>
            </div>
          </q-btn>
          <!-- funds -->
          <q-btn class="menu-item" flat :to="{ name: 'MemberFunds' }">
            <q-icon class="icon-first">
              <img :src="svgIcon('transactionHistoryDetails')" />
            </q-icon>
            <div class="menu-content">
              <div>{{ $t("menu.fundsDetails") }}</div>
            </div>
          </q-btn>
          <!-- promotion -->
          <q-btn class="menu-item" flat :to="{ name: 'promotion' }">
            <q-icon class="icon-first">
              <img :src="svgIcon('promotions')" />
            </q-icon>
            <div class="menu-content">
              <div>{{ $t("menu.promotions") }}</div>
            </div>
          </q-btn>
          <!-- Message Center -->
          <q-btn class="menu-item" flat :to="{ name: 'memberInbox' }">
            <q-icon class="icon-first">
              <img :src="svgIcon('messageCenter')" />
            </q-icon>
            <div class="menu-content">
              <div>{{ $t("member.mail.messageCenter") }}</div>
            </div>
          </q-btn>
          <!-- information -->
          <!-- <q-btn class="menu-item" flat :to="{ name: 'infoCenter' }">
          <q-icon class="icon-first">
            <img :src="svgIcon('info')" />
          </q-icon>
          <div class="menu-content">
            <div>{{ $t("menu.about_us") }}</div>
            <div class="sub-text">
              {{ $t("member.profile.responsible") }} | {{ $t("member.profile.TC") }} |
              {{ $t("member.profile.privacy") }}
            </div>
          </div>
        </q-btn> -->
          <!-- KYC -->
          <!-- <q-btn class="menu-item" flat :to="{ name: 'MemberKyc' }" v-if="!userInfo2.approval_status">
          <q-icon class="icon-first">
            <img :src="svgIcon('info')" />
          </q-icon>
          <div class="menu-content">
            <div>{{ $t("menu.getVerify") }}</div>
          </div>
        </q-btn> -->
        </div>
      </div>
      <div class="contact-container">
        <!-- withdrawal password -->
        <q-btn class="w-full p-0 flex" flat  @click="handleOpenLiveChat">
          <q-icon class="icon-first mr-2">
            <img :src="svgIcon('ic_round-support-agent')" />
          </q-icon>
          <div class="menu-content font-normal">
            <div>{{ $t("common.btn.onlineService") }}</div>
          </div>
          <q-icon name="navigate_next" class="icon-last ml-auto"></q-icon>
        </q-btn>
        <q-separator class="my-2" v-if="showWithdrawalPassword" />
        <q-btn class="w-full p-0 flex" flat  :to="{ name: 'infoCenter' }">
          <q-icon class="icon-first mr-2">
            <img :src="svgIcon('ri_information-fill')" />
          </q-icon>
          <div class="menu-content font-normal">
            <div>{{ $t("menu.about_us") }}</div>
          </div>
          <div class="sub-text font-normal text-xs text-[#848484] ml-auto">
            {{ $t("member.profile.responsible") }} | {{ $t("member.profile.TC") }} |
            {{ $t("member.profile.privacy") }}
          </div>
          <q-icon name="navigate_next" class="icon-last"></q-icon>
        </q-btn>
      </div>
      <q-btn class="w-full p-0 flex mt-3 border border-[#D3493A66] py-2 text-[#D3493A] logout-btn" outline flat @click="logout">
        {{ $t("common.btn.logout") }}
      </q-btn>
    </div>

    <FooterNav />
  </div>
  <div v-else class="profile-pc">
    <div class="profile-header">
      <p class="profile-header-title">{{ $t("menu.profile") }}</p>
      <div>
        <q-btn rounded flat icon="mail" class="top-btn" :to="{ name: 'memberInbox' }"></q-btn>
        <q-btn v-if="isMayaLogin == false" rounded flat class="top-btn btn-kyc" :to="{ name: 'MemberKyc' }">
          <img :src="svgIcon('icon_kyc')" />
          {{ $t("member.kyc.kyc_status") }}
        </q-btn>
      </div>
    </div>

    <q-card class="profile-body">
      <!-- profile detail -->
      <q-card-section class="section">
        <div class="title">
          <q-icon name="fa-regular fa-circle-user" />
          <span>{{ $t("member.profile.personalInformation") }}</span>
        </div>
        <div class="content">
          <q-btn rounded flat :to="{ name: 'memberProfileDetail' }" class="btn-setup">Set up</q-btn>
        </div>
      </q-card-section>
      <!-- change login password -->
      <q-card-section class="section">
        <div class="title">
          <q-icon name="key" />
          <span>{{ $t("member.profile.loginPassword") }}</span>
        </div>
        <div class="content">
          <q-btn rounded flat class="btn-setup" :to="{ name: 'memberChangePassword' }">{{
            $t("common.btn.setUp")
          }}</q-btn>
        </div>
      </q-card-section>
      <!-- change withdraw password -->
      <q-card-section class="section" v-if="showWithdrawalPassword">
        <div class="title">
          <q-icon name="key" />
          <span>{{ $t("member.profile.withdrawPassword") }}</span>
        </div>
        <div class="content">
          <q-btn rounded flat class="btn-setup" :to="{ name: 'memberChangeWithdrawalPassword' }">{{
            $t("common.btn.setUp")
          }}</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <!-- 給修改密碼用 -->
  <router-view></router-view>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useEnvInfoStore } from "src/stores/envStore"
import { useAuth } from "src/common/hooks/useAuth"
import { useBank } from "src/common/composables/useBank"
import { useCommon } from "src/common/hooks/useCommon"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { WALLET_TYPE, PROMOTION_CONDITION } from "src/common/utils/constants"
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import { useSiteRedirect } from "app/template/okbet_green/composables/useSiteRedirect"
import Avatar from "./components/Avatar.vue"
import { useVip } from "src/common/composables/useVip"
import FooterNav from "../../components/Footer/FooterNav.vue"
import VipProgress from "./components/VipProgress.vue"

const { handleLogout } = useAuth()
const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}

const router = useRouter()
const { initVipMultiCurrency, getCurrencyCode, userMultiStatisticsMap, memberVipList, userInfo } = useVip()
const { moneyFormat } = useCommon()
const { userInfo2, inUseWallet, getUserWalletList, isLoading } = useUserInfo()
const { memberImg, svgIcon } = useSiteImg()
const { commonResult } = useCommonImg()
const { handleOpenLiveChat } = useLiveChat()
const { handleRedirectDeposit, handleRedirectWithdrawal } = useSiteRedirect()
const { isMayaLogin } = useAuth()
const { showWithdrawalPassword } = useEnv()
const currentVip = computed(
  () => memberVipList.value.filter((item, index) => item.id === userInfo.value.member_level)[0]
)
const nextVipIndex = computed(
  () => memberVipList.value.findIndex((item, index) => item.id === userInfo.value.member_level) + 1
)
const nextVipData = computed(() => memberVipList.value[nextVipIndex.value])
const isLast = computed(() => nextVipIndex.value === memberVipList.value.length)
console.log(userInfo.value, currentVip)

onMounted(async () => {
  await initVipMultiCurrency()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";
@import "app/template/okbet_green/assets/css/button.scss";
@import "app/template/okbet_green/assets/css/member.scss";

.profile-pc {
  max-width: 61.25rem;
  height: 100%;
  padding: 4.375rem 3.125rem 1.875rem;
  .profile-header {
    @apply w-full flex justify-between items-center;

    .profile-header-title {
      @apply font-extrabold text-[3.125rem];
      color: $text-light-secondary;
    }
    .title-img {
      width: 10.5625rem;
      height: auto;
    }
    .top-btn {
      @include btn-mail-purple;
      .q-icon {
        @apply mr-[.3125rem] text-[1.25rem];
      }
      img {
        @apply w-[1.25rem] h-[1.25rem] mr-[.3125rem];
      }
    }
    .btn-kyc {
      margin-left: 10px;
      background: none !important;
      border: 2px solid;
      line-height: 0;
    }
  }
  .profile-body {
    @apply w-full flex justify-between items-center flex-wrap  gap-10;
    margin-top: 1.5625rem;
    box-shadow: none;
    background-color: $bg-dark-secondary;

    .section {
      @apply flex justify-between items-start flex-col;
      width: 26.25rem;
      min-height: 8rem;
      border: 2px solid $border-dark;
      border-radius: 0.875rem;
      padding: 1.5625rem;
      .title {
        @apply w-full flex justify-start items-center;
        color: $text-light-secondary;
        .q-icon {
          font-size: 32px;
        }
        span {
          margin-left: 0.5625rem;
          font-size: 1.5rem;
          line-height: 1.2;
          font-weight: 860;
        }
      }
      .content {
        @apply w-full flex justify-end;
        .btn-setup {
          @include btn-common-purple;
        }
      }
    }
  }
}

.profile-h5 {
  .scroll-container {
    height: calc(100vh - 158px);
    padding: 1.5rem 0;
    margin-top: 0.5rem;
    overflow: scroll;
  }
  // height: 100vh;
  // padding-bottom: 4rem;
  .info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: row;
    padding: 0.5rem 0px;
    @include phone-width {
      padding: 0.25rem 0px;
    }
    .q-btn {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      .icon-service {
        @apply w-[3rem] h-[3rem];
        @include useProfileIcon;
        display: inline-block;
        margin: 0px;
        background-position-x: -11.25rem;
        @include phone-width {
          @apply w-[1.625rem] h-[1.5rem];
          background-position-x: -6.25rem;
        }
      }
      .icon-mail {
        @include useProfileIcon;
        display: inline-block;
        width: 48px;
        height: 44px;
        margin: 0px;
        background-position-x: -246.154px;
        @include phone-width {
          width: 26.4554px;
          height: 24.25px;
          background-position-x: -137.821px;
        }
      }
    }
  }
  .info-container {
    margin-top: 2.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .info-content {
      padding-left: 2rem;
      h3 {
        font-size: 2.5rem;
        font-weight: 700;
        font-family: NotoSansTC;
        line-height: 3.5rem;
        color: rgba(0, 0, 0, 0.8);
        padding-bottom: 0.625rem;
        display: inline;
      }
      p {
        font-size: 1.5rem;
        font-weight: 700;
        font-family: NotoSansTC;
        line-height: 2rem;
        color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
      }
    }

    .mobile-kyc-btn {
      @apply py-[.25rem] ml-[1rem];
      background: rgba(0, 0, 0, 0.2) !important;
      border: none;
      line-height: 0;
      min-height: auto;
      font-size: 11px;
      color: #fff;
      img {
        width: 1rem;
        margin-right: 0.25rem;
      }
    }

    @include phone-width {
      .info-content {
        padding-left: 1rem;
        h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          padding-bottom: 0.3125rem;
        }
        p {
          font-size: 0.875rem;
          line-height: 1rem;
        }
      }
      .btn-profile-detail {
        :deep(.q-icon) {
          font-size: 1rem;
          font-weight: bold;
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }
  }

  .vip_container {
    background-color: #fff;
    border-radius: 10px;
    padding: 0.5rem 0.8rem;
    .vip_content {
      background-color: #fff;
    }
    .btn-vip {
      padding: 0;
      :deep(.q-icon) {
        font-size: 0.875rem;
        color: #1fab3d;
      }
    }
  }

  .wallet-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 0.5rem 0.8rem;
    margin-top: 1.5rem;
    .btn-refresh {
      :deep(.q-icon) {
        font-size: 0.875rem;
      }
      &.active {
        animation: 0.3s linear 0s 1 normal forwards running reFreshAni;
      }
    }
  }

  .contact-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 0.5rem 0.8rem;
    margin-top: 1.5rem;
  }

  .wallet-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: row;
    padding: 0px 4.25rem 0px 3.375rem;
    height: 10rem;
    background: rgb(255, 255, 255);
    border: 0.5px solid rgb(255, 255, 255);
    box-shadow: rgba(148, 161, 200, 0.12) 0px 4px 10px, rgba(255, 255, 255, 0.8) 0px 2px 2px inset;
    border-radius: 10px;
    .wallet-body-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row;
      .icon-deposit {
        @include useProfileIcon;
        width: 8.375rem;
        height: 8.375rem;
        background-position-x: -391.877px;
      }
      .icon-withdrawal {
        @include useProfileIcon;
        width: 8.375rem;
        height: 8.375rem;
        background-position-x: -545.477px;
      }
      .title {
        font-weight: 700;
        font-size: 1rem;
        line-height: 1.4375rem;
        color: $color-white;
        padding-bottom: 0.5rem;
        font-family: NotoSansTC;
      }
      .sub-title {
        font-family: "DIN Alternate";
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.5rem;
        color: rgb(167, 178, 196);
        text-transform: uppercase;
      }
    }
    .divider {
      width: 1px;
      height: 5rem;
      background-color: $border-dark-secondary;
    }
    @include phone-width {
      padding: 0px 2rem 0px 1rem;
      height: 5rem;
      border: none;
      box-shadow: none;
      .wallet-body-content {
        .icon-deposit {
          width: 4.25rem;
          height: 4.25rem;
          background-position-x: -219.41px;
        }
        .icon-withdrawal {
          width: 4.25rem;
          height: 4.25rem;
          background-position-x: -305.41px;
        }
        img {
          margin-right: 1.0625rem;
        }
        .title {
          font-size: 1.0625rem;
          line-height: 1.375rem;
          padding-bottom: 0.25rem;
          color: $text-light-secondary;
        }
        .sub-title {
          font-size: 0.6875rem;
          line-height: 0.75rem;
        }
      }
      .divider {
        height: 2.5rem;
      }
    }
  }
  .menu-list {
    margin-top: 1.25rem;
    list-style: none;
    background: #fff;
    border: 0.5px solid rgb(255, 255, 255);
    box-shadow: rgba(148, 161, 200, 0.12) 0px 4px 10px, rgba(255, 255, 255, 0.8) 0px 2px 2px inset;
    border-radius: 10px;
    @include phone-width {
      border: none;
      box-shadow: none;
    }
    .menu-item {
      width: 100%;
      // padding: 1.625rem 0px 1.625rem 1.5rem;
      :deep(.q-btn__content) {
        justify-content: space-between;
        .icon-first {
          font-size: 2.5rem;
        }
        .menu-content {
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
          flex: 1 1 0%;
          font-size: 1.75rem;
          line-height: 2.5rem;
          color: rgb(108, 123, 168);
          padding-left: 1.25rem;
          text-transform: capitalize;
          font-weight: 400;
          .sub-text {
            font-size: 1.5rem;
            color: rgb(167, 178, 196);
          }
          .icon-gift {
            @include useProfileIcon;
            width: 2.5rem;
            height: 2.5rem;
            background-position-x: -61.0462px;
          }
        }
        .icon-vip {
          @include useVipIcon;
          width: 2.5rem;
          height: 2.5rem;
        }
        .icon-last {
          margin-right: 0.75rem;
          font-size: 2.5rem;
          color: rgb(167, 178, 196);
          font-weight: 600;
        }
      }
    }
    .q-separator {
      margin-left: 5.75rem;
      margin-right: 1.75rem;
      height: 2px;
      background-color: $bg-dark;
    }
    @include phone-width {
      display: flex;
      flex-wrap: wrap;
      gap: 2%;
      margin-top: 1.25rem;
      .menu-item {
        width: 32%;
        justify-content: center;
        margin-bottom: 1.5rem;
        :deep(.q-btn__content) {
          @apply flex flex-col justify-between items-center;
          .icon-first {
            width: 1.75rem;
            height: 1.75rem;
            margin-bottom: 0.5rem;
          }
          .menu-content {
            font-size: 0.75rem;
            line-height: 1rem;
            color: #000000cc;
            padding-left: 0;
            .sub-text {
              font-size: 0.625rem;
              color: #000000cc !important;
            }
            .icon-gift {
              @include useProfileIcon;
              width: 1.25rem;
              height: 1.25rem;
              background-position-x: -34.1795px;
            }
          }
          .icon-vip {
            @include useVipIcon;
            width: 1.25rem;
            height: 1.25rem;
          }
          .icon-last {
            margin-right: 0.375rem;
            font-size: 1.25rem;
          }
        }
      }
      .q-separator {
        margin-left: 2.275rem;
        margin-right: 0.875rem;
        height: 1px;
        background-color: $border-dark-secondary;
        transform: scaleY(1);
        border: none;
      }
    }
  }

  .logout-btn {
    border-radius: 5px;
    border: 1.5px solid #D3493A66;
  }
}
</style>
