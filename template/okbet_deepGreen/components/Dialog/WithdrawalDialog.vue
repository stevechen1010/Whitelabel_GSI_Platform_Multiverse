<template>
  <q-dialog v-model="dialogShow" persistent class="dialog-base" position="bottom" @hide="handleClose">
    <q-card>
      <q-card-section>
        <div class="dialog-title-wrapper">
          <div class="dialog-title-text">
            <div>{{ $t("menu.withdrawal") }}</div>
            <div class="audit-wrapper">
              <p>{{ $t("member.withdrawal.auditTurnover") }}：</p>
              <span>{{ moneyFormat(currentAudit) }}</span>
            </div>
          </div>
          <div class="dialog-title-icon" @click="handleClose">
            <q-img class="close-icon" :src="closeIcon" />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <ul class="btn-wrapper">
          <li
            v-for="item in mayaDepositWithdrawalState.withdrawal_quick_btns"
            @click="handleMayaDepositQuickBtnClick(item)"
            :key="item"
            class="quick-btn"
            :class="{ 'quick-btn-active': mayaDepositWithdrawalState.selectedQuickBtn === item }"
          >
            {{ moneyFormat(item) }}
          </li>
        </ul>

        <div class="amount-wrapper">
          <div class="amount-title">{{ $t("member.deposit.withdrawAmount") }}</div>
          <q-input v-model="amount" borderless />
        </div>

        <div class="action-btns">
          <q-btn :label="$t('common.btn.confirm')" class="submit-btn text-capitalize" @click="handleSubmit" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useBank } from "src/common/composables/useBank"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { useSiteImg } from "../../hooks/useSiteImg"
import { useApi } from "src/common/hooks/useApi"
import * as userInfoApi from "src/api/userInfo"

const emit = defineEmits<{
  close: []
}>()

const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { closeIcon } = useSiteImg()
const eventbus = injectStrict(EventBusKey)
const { getUserWalletList, userWalletMap } = useUserInfo()
const { moneyFormat } = useCommon()
const { mayaDepositWithdrawalState, handleMayaDepositQuickBtnClick, handleMayaWithdrawalSubmit } = useBank()
const dialogShow = ref(false)
const currentAudit = ref("")
const amount = computed({
  get: () => mayaDepositWithdrawalState.form.amount,
  set: (val) => {
    mayaDepositWithdrawalState.form.amount = val
  }
})

const handleClose = () => {
  dialogShow.value = false
  emit("close")
  initMayaDepositWithdrawalState()
}

const filterCurrency = async () => {
  try {
    const { status, data } = await useApi(userInfoApi.getUserWalletList)

    if (!status) {
      $q.notify({
        type: "negative",
        message: `Api error`,
        position: "top"
      })
      return
    }

    const phpWallet = data.find((item) => item.currency_code === "PHP" && item.wallet_type === 1)

    const remainingTurnover = phpWallet?.remaining_turnover
    currentAudit.value = remainingTurnover as string
  } catch (error) {
    $q.notify({
      type: "negative",
      message: `Filter currency failed. ${error}, wallet: ${JSON.stringify(userWalletMap.value)}`,
      position: "top"
    })
  }
}

const initMayaDepositWithdrawalState = () => {
  mayaDepositWithdrawalState.form = {
    amount: "",
    currency: "",
    promotion_id: 0
  }
  mayaDepositWithdrawalState.selectedQuickBtn = ""
}

const handleSubmit = async () => {
  try {
    const { status } = await handleMayaWithdrawalSubmit()

    if (status) {
      await getUserWalletList()
      handleClose()
      $q.notify({
        type: "positive",
        message: t("common.alarm.withdrawSuccess"),
        position: "top"
      })
    }
  } catch (error) {
    console.log("error", error)
  }
}

onMounted(() => {
  eventbus.on("openWithdrawalDialog", async (show: boolean) => {
    try {
      await filterCurrency()
      dialogShow.value = show
    } catch (error) {
      $q.notify({
        type: "negative",
        message: `Unable to open withdrawal dialog. ${error}`,
        position: "top"
      })
    }
  })
})
</script>

<style lang="scss" scoped>
@import "app/template/okbet_deepGreen/assets/css/_variable.sass";
@import "app/template/okbet_deepGreen/assets/css/dialog.scss";

.audit-wrapper {
  @apply flex items-center justify-center text-sm;
  color: $text-gray-tertiary;
}

.quick-btn {
  background: #3b7b64 !important;
}

.submit-btn {
  background: $bg-light !important;
}
</style>
