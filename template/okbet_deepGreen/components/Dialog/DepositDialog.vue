<template>
  <q-dialog v-model="dialogShow" persistent class="dialog-base" position="bottom" @hide="handleClose">
    <q-card>
      <q-card-section>
        <div class="dialog-title-wrapper">
          <div class="dialog-title-text">
            <div>{{ $t("menu.deposit") }}</div>
          </div>
          <div class="dialog-title-icon" @click="handleClose">
            <q-img class="close-icon" :src="closeIcon" />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <ul class="btn-wrapper">
          <li
            v-for="item in mayaDepositWithdrawalState.deposit_quick_btns"
            @click="handleMayaDepositQuickBtnClick(item)"
            :key="item"
            class="quick-btn"
            :class="{ 'quick-btn-active': mayaDepositWithdrawalState.selectedQuickBtn === item }"
          >
            {{ moneyFormat(item) }}
          </li>
        </ul>

        <div class="form-promotion-wrapper" v-if="mayaDepositWithdrawalState.promotion_list.length > 0">
          <div class="form-title">{{ $t("member.deposit.depositReward") }}</div>
          <div class="form-promotion-list">
            <PromotionList
              v-for="item in mayaDepositWithdrawalState.promotion_list"
              :key="item.id"
              :item="item"
              :activeId="mayaDepositWithdrawalState.form.promotion_id"
              @click="handleMayaDepositPromotionClick(item.id)"
            />
          </div>
        </div>

        <div class="amount-wrapper">
          <div class="amount-title">{{ $t("member.deposit.depositAmount") }}</div>
          <q-input
            v-model="mayaDepositWithdrawalState.form.amount"
            :rules="[
              Rules.required(),
              (val: string) => Rules.depositAmount({ min: depositState.paymentDetail.deposit_min, max: depositState.paymentDetail.deposit_max, val })
            ]"
            borderless
            inputmode="numeric"
            pattern="[0-9]*"
            lazy-rules
            :placeholder="`${depositState.paymentDetail.deposit_min} ~ ${depositState.paymentDetail.deposit_max}`"
          />
        </div>

        <div class="action-btns">
          <q-btn :label="$t('common.btn.confirm')" class="submit-btn text-capitalize" @click="handleSubmit" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useDebounceFn } from "@vueuse/core"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { useSiteImg } from "../../hooks/useSiteImg"
import PromotionList from "app/template/okbet_deepGreen/pages/MemberCenter/components/PromotionList.vue"
import { useCommon } from "src/common/hooks/useCommon"

const emit = defineEmits<{
  close: []
}>()

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { moneyFormat } = useCommon()
const { closeIcon } = useSiteImg()
const eventbus = injectStrict(EventBusKey)
const { getUserWalletList } = useUserInfo()
const {
  mayaDepositWithdrawalState,
  getDepositPaymentList,
  getMayaPromotionList,
  handleMayaDepositPromotionClick,
  handleMayaDepositQuickBtnClick,
  handleMayaDepositSubmit,
  depositState
} = useBank()
const dialogShow = ref(false)

const handleClose = () => {
  dialogShow.value = false
  emit("close")
  initMayaDepositWithdrawalState()
}

const initMayaDepositWithdrawalState = () => {
  mayaDepositWithdrawalState.form = {
    amount: "",
    currency: "",
    promotion_id: 0
  }
  mayaDepositWithdrawalState.promotion_list = []
  mayaDepositWithdrawalState.selectedQuickBtn = ""
}

const handleSubmit = async () => {
  const amount = Number(mayaDepositWithdrawalState.form.amount)

  if (
    amount < Number(depositState.paymentDetail.deposit_min) ||
    amount > Number(depositState.paymentDetail.deposit_max)
  ) {
    $q.notify({
      type: "negative",
      message: t("common.validate.amountExceedLimit"),
      position: "top"
    })
    return
  }

  try {
    const { status } = await handleMayaDepositSubmit()

    if (status) {
      await getUserWalletList()
      handleClose()
      $q.notify({
        type: "positive",
        message: t("common.alarm.depositSuccess"),
        position: "top"
      })
    }
  } catch (error) {
    console.log("error", error)
  }
}

onMounted(() => {
  eventbus.on("openDepositDialog", (show: boolean) => {
    dialogShow.value = show
    getUserWalletList()
    getDepositPaymentList()
  })
})

// 監聽 amount
const debounceFn = useDebounceFn(() => getMayaPromotionList(mayaDepositWithdrawalState.form.amount), 500)
watch(
  () => mayaDepositWithdrawalState.form.amount,
  () => debounceFn()
)

watch(
  () => mayaDepositWithdrawalState.promotion_list,
  (newPromotionList) => {
    if (mayaDepositWithdrawalState.form.promotion_id === 0) {
      return
    }

    const isPromotionStillAvailable = newPromotionList.some(
      (p) => p.id === mayaDepositWithdrawalState.form.promotion_id
    )

    if (!isPromotionStillAvailable) {
      mayaDepositWithdrawalState.form.promotion_id = 0
    }
  }
)
</script>

<style lang="scss" scoped>
@import "app/template/okbet_deepGreen/assets/css/dialog.scss";

.form-promotion-wrapper {
  .form-title {
    @apply text-base font-semibold my-5;
  }
  .form-promotion-list {
    @apply grid grid-cols-2 gap-4 text-[.8125rem];

    .promotion-container {
      @apply w-full max-w-full !important;
    }
  }
}
</style>

<style lang="scss">
@import "app/template/okbet_deepGreen/assets/css/_variable.sass";

// quasar 的 dialog 樣式綁在 body 層，所以需要移除 scoped，且等於 withdrawal dialog 也能吃到
.dialog-base {
  .q-dialog__inner {
    color: $text-light-secondary !important;

    .q-card {
      background: $bg-dark-secondary !important;
    }
  }
}

.quick-btn {
  background: #3b7b64 !important;
}

.submit-btn {
  background: $bg-light !important;
}

.quick-btn-active {
  border: 2px solid !important;
  border-color: $border-light !important;
}
</style>
