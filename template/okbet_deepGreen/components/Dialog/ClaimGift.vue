<template>
  <q-dialog
    v-model="show"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    :no-backdrop-dismiss="true"
  >
    <q-card
      v-if="giftsList.length > 0"
      class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]"
    >
      <canvas ref="coinCanvas" class="absolute top-0 left-0 w-full h-full pointer-events-none z-10"></canvas>
      <div class="relative flex flex-col items-center py-10 px-16">
        <q-btn
          class="absolute top-0 right-0 text-white"
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="closeDialog"
        />
        <q-badge class="absolute top-24 right-12 !bg-[#224F3F] text-lg" rounded :label="giftsList.length" />
        <span
          class="bg-gradient-to-r from-[#F8E8BD] to-[#EDB266] bg-clip-text text-3xl text-transparent font-bold mb-2"
          >{{ t("promotion.pick_and_win") }}</span
        >
        <q-img width="200px" :src="claimGiftImg('giftBox.png')" loading="lazy" />
        <q-btn
          class="mt-10 bg-[#224F3F] text-white text-lg"
          unelevated
          rounded
          :label="t('promotion.pick_now')"
          @click="claimDialog = true"
        />
      </div>
    </q-card>
    <q-card v-else class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]">
      <div class="relative flex flex-col items-center py-10 px-16">
        <q-btn
          class="absolute top-0 right-0 text-white"
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="closeDialog"
        />
        <span class="!text-white text-3xl text-transparent font-bold">{{ t("promotion.no_bonus") }}</span>
        <q-img width="200px" :src="claimGiftImg('giftBox_disabled.png')" loading="lazy" />
        <q-btn class="mt-10" unelevated rounded color="grey-13" disable :label="t('promotion.pick_now')" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="claimDialog" persistent transition-show="scale" transition-hide="scale">
    <q-card v-if="giftsList.length" class="bg-[#122E24] p-4 !rounded-xl" style="width: 600px">
      <q-card-section class="flex justify-between items-center">
        <div v-if="giftsList[0].options.length > 1" class="text-white text-bold text-2xl">
          {{ t("promotion.select_currency") }}
        </div>
        <div v-else class="text-white text-bold text-2xl">{{ t("promotion.congratulations") }}</div>
        <q-btn
          class="absolute top-0 right-0 text-white"
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="closeDialog"
        />
      </q-card-section>
      <q-card-section
        v-if="giftsList[0].options.length > 1"
        class="q-pa-none flex flex-col justify-center items-center"
      >
        <div class="bg-[#224F3F] rounded-full px-3 py-1 mb-2 flex items-center">
          <select v-model="selectedIndex" class="w-fit border-none bg-[#224F3F] text-white focus:outline-none text-xl">
            <option
              class="text-white bg-[#224F3F]"
              v-for="(option, index) in giftsList[0].options"
              :value="index"
              :key="option.currency_code"
            >
              {{ option.currency_code }}
            </option>
          </select>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none flex justify-center items-center text-2xl mt-4">
        <span class="text-[#C4C4C4]"
          >{{ t("promotion.you_get") }}
          <span class="text-[#52FFC1]">{{ moneyFormat(giftsList[0].options[selectedIndex].amount, 4) }}</span>
          {{ currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code }}</span
        >
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          class="mt-4 mb-4 !px-8 text-xl bg-[#224F3F] text-white"
          unelevated
          rounded
          :label="t('common.btn.confirm')"
          @click="
            claimGift(
              giftsList[0].id,
              parseFloat(giftsList[0].options[selectedIndex].amount),
              giftsList[0].options[selectedIndex].currency_id
            )
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { ref, computed, watch, nextTick, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/okbet_deepGreen/hooks/useSiteImg"
import { useCoinsAnimation } from "src/common/composables/useClaimGift"
import { useGiftStore } from "src/stores/giftStore"
import { useBank } from "src/common/composables/useBank"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useCommon } from "src/common/hooks/useCommon"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const eventbus = injectStrict(EventBusKey)
const { currencyIdMap } = useBank()
const { moneyFormat } = useCommon()
const giftStore = useGiftStore()
const giftsList = computed(() => giftStore.giftState.list)
const { t } = useI18n()
const $q = useQuasar()
const { coinCanvas, startCoinAnimation, stopAnimation } = useCoinsAnimation()
const { ClaimGift } = useClaimGift()
const { getUserWalletList } = useUserInfo()
const { claimGiftImg } = useSiteImg()

const show = ref(false)
const claimDialog = ref(false)
const selectedIndex = ref(0)

watch(show, async (newVal) => {
  if (newVal) {
    await nextTick()
    startCoinAnimation()
  } else {
    stopAnimation()
  }
})

function closeDialog() {
  claimDialog.value = false
  eventbus.emit("openClaimGiftDialog", false)
}

async function claimGift(id: number, amount: number, currency: number) {
  $q.loading.show()
  const status = await ClaimGift({
    gift_id: id,
    amount,
    currency
  })
  $q.loading.hide()
  if (!status) return
  claimDialog.value = false
  $q.notify({
    type: "positive",
    message: t("common.alarm.successfullyClaimed"),
    position: "top",
    timeout: 1000
  })
  await getUserWalletList()

  selectedIndex.value = 0
  if (giftsList.value.length === 0) {
    closeDialog()
  }
}

onMounted(async () => {
  eventbus.on("openClaimGiftDialog", (value: boolean) => {
    show.value = value
  })
})
</script>

<style scoped lang="scss"></style>
