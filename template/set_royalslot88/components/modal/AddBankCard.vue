<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom" use-title :title="$t('member.bank.addBank')">
    <q-form @submit="submitForm()">
      <div class="provider-menu-wrap2">
        <!-- 幣別 -->
        <div class="provider-menu--wrap">
          <div class="af-swp-ttl">{{ $t("member.bank.selectCurrency") }}</div>
          <div class="currency-selection">
            <ul class="nav nav-tabs flex-wrap" id="myTab" role="tablist">
              <li
                v-for="item in availCurrencyList"
                :key="item.id"
                class="nav-item"
                @click="handleBankCardCurrencyClick(item.code)"
              >
                <q-btn :class="{ active: `${item.code}` === bankCardState.form.currency }" class="nav-link hide-hover">
                  {{ $t(item.code) }}
                </q-btn>
              </li>
            </ul>
          </div>
        </div>

        <div class="tab-content" id="v-pills-tabContent">
          <div class="tab-pane fade active show" id="myr2" role="tabpanel" aria-labelledby="tab">
            <div class="af-in-box">
              <div class="af-in-content-box">
                <!-- 支付方式 -->
                <div class="payment-sel">
                  <ul class="nav nav-tabs" role="tablist">
                    <li
                      v-for="item in paymentTypeList"
                      :key="item.value"
                      class="nav-item cursor-pointer"
                      role="presentation"
                      @click="handleBankCardPaymentTypeClick(item.value)"
                    >
                      <a
                        class="nav-link keychainify-checked block"
                        :class="{ active: String(item.value) === `${bankCardState.form.payment_type_id}` }"
                      >
                        {{ $t(item.label) }}
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="af-tab">
                  <div class="tab-content">
                    <div class="tab-pane active" id="popbank-1" role="tabpanel">
                      <div class="af-tab-in-content">
                        <div class="af-tab-in-content col-row">
                          <!-- gateway id -->
                          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet">
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("modal.gateway") }}</label>
                              <div class="cl-r">
                                <q-select
                                  v-model="bankCardState.form.payment_gateway_id"
                                  :options="paymentGatewayList"
                                  emit-value
                                  map-options
                                  bg-color="transparent"
                                  color="white"
                                  options-dark
                                  outlined
                                  lazy-rules
                                  :rules="[Rules.requiredInt]"
                                  class="form-control inputDeposit p-0"
                                />
                              </div>
                            </div>
                            <!-- bank id -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.withdrawalBank") }}</label>
                              <div class="cl-r">
                                <q-select
                                  v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.EWallet"
                                  v-model="bankCardState.form.bank_id"
                                  :options="bankList"
                                  :disable="!bankCardState.form.payment_gateway_id"
                                  emit-value
                                  map-options
                                  bg-color="transparent"
                                  color="white"
                                  options-dark
                                  outlined
                                  lazy-rules
                                  :rules="[Rules.requiredInt]"
                                  class="form-control inputDeposit p-0"
                                />
                              </div>
                            </div>
                          </template>

                          <!-- bank_name -->
                          <div
                            v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.BankTransfer"
                            class="af-row"
                          >
                            <label class="deposit-label">{{ $t("member.bank.withdrawalBank") }}</label>
                            <div class="cl-r">
                              <q-input
                                v-model="bankCardState.form.bank_name"
                                class="form-control inputDeposit"
                                dense
                                borderless
                                :placeholder="$t('member.bank.withdrawalBank')"
                                lazy-rules
                                :rules="[Rules.required()]"
                              />
                            </div>
                          </div>
                          <!-- name -->
                          <div class="af-row">
                            <label class="deposit-label">{{ $t("member.bank.name") }}</label>
                            <div class="cl-r">
                              <q-input
                                v-model="bankCardState.form.name"
                                class="form-control inputDeposit"
                                dense
                                borderless
                                :placeholder="$t('member.bank.name')"
                                lazy-rules
                                :rules="[Rules.required()]"
                              />
                            </div>
                          </div>
                          <!-- 虛擬幣種 -->
                          <template v-if="bankCardState.form.payment_type_id === FUND_METHOD_TYPE.Enums.Crypto">
                            <!-- walletAddress -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.walletAddress") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.wallet_address"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.walletAddress')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- currencyBrand -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.currencyBrand") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.currency_brand"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.currencyBrand')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- chain -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.chain") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.chain"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.chain')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                          </template>
                          <!-- 共用的區塊 -->
                          <template v-else>
                            <!-- accountName -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.accountName") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.account_name"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.accountName')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                />
                              </div>
                            </div>
                            <!-- accountNumber -->
                            <div class="af-row">
                              <label class="deposit-label">{{ $t("member.bank.accountNumber") }}</label>
                              <div class="cl-r">
                                <q-input
                                  v-model="bankCardState.form.account_number"
                                  class="form-control inputDeposit"
                                  dense
                                  borderless
                                  :placeholder="$t('member.bank.accountNumber')"
                                  lazy-rules
                                  :rules="[Rules.required()]"
                                  @update:model-value="validateAlphanumeric"
                                />
                              </div>
                            </div>
                          </template>

                          <div class="af-btn">
                            <button class="cancel_btn" @click="modalShow = false">{{ $t("common.btn.cancel") }}</button>
                            <button class="submit_btn" type="submit">{{ $t("common.btn.submit") }}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </ModalBase>
</template>

<script setup lang="ts">
import { useBank } from "src/common/composables/useBank"
import { useRule } from "src/common/hooks/useRule"
import { FUND_METHOD_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { onMounted, ref, watch } from "vue"

import ModalBase from "./modalBase.vue"

const Rules = useRule()
const {
  availCurrencyList,
  getAvailCurrencyList,
  bankCardState,
  validateAlphanumeric,
  getBankCardInfo,
  getBankCardList,
  getPaymentTypeList,
  paymentGatewayList,
  paymentTypeList,
  currencyList,
  handleBankCardCurrencyClick,
  handleBankCardPaymentTypeClick,
  bankList,
  getBankList,
  getGatewayList,
  handleBankCardEdit,
  handleBankCardAdd,
  resetBankCardForm
} = useBank()

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)
const editBankCardId = ref(0)

const submitForm = async () => {
  const submitFunc = editBankCardId.value ? handleBankCardEdit : handleBankCardAdd
  const isSuccess = await submitFunc()
  if (isSuccess) {
    await getBankCardList()
    modalShow.value = false
    resetBankCardForm()
    eventbus.emit("updateWithdrawBankCardList")
    eventbus.emit("updateBankCardList")
  }
}

watch(
  () => bankCardState.form.payment_gateway_id,
  async (gatewayId) => {
    await getBankList(gatewayId)
  }
)

onMounted(() => {
  eventbus.on("openAddBankCard", async (show: boolean, bankCardId?: number) => {
    modalShow.value = show
    editBankCardId.value = bankCardId ? bankCardId : 0

    if (show) {
      getGatewayList()
      getBankList()
      getAvailCurrencyList()
      resetBankCardForm()
      if (bankCardId) {
        await getBankCardInfo({ id: editBankCardId.value })
      }
      await getPaymentTypeList(bankCardState.form.currency)
    }
  })
})
</script>

<style scoped lang="scss">
@import "src/css/button.scss";
@import "app/template/set_royalslot88/assets/css/deposit.css";
@import "app/template/set_royalslot88/assets/css/withdrawal.css";
@import "app/template/set_royalslot88/assets/css/bank.css";
@import "app/template/set_royalslot88/assets/css/form.scss";
</style>
