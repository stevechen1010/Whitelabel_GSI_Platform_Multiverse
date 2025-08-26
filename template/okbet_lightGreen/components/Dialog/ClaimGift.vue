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
        <q-badge class="absolute top-24 right-12 !bg-[#FF0000] text-lg" rounded :label="giftsList.length" />
        <span
          class="bg-gradient-to-r from-[#F8E8BD] to-[#EDB266] bg-clip-text text-3xl text-transparent font-bold mb-2"
          >{{ t("promotion.pick_and_win") }}</span
        >
        <q-img width="200px" :src="claimGiftImg('giftBox.png')" loading="lazy" />
        <q-btn
          class="mt-10 bg-[#1FAB3D] text-white text-lg"
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
    <q-card v-if="giftsList.length" class="bg-[#fff] p-4 !rounded-xl" style="width: 600px">
      <q-card-section class="flex justify-between items-center">
        <div v-if="giftsList[0].options.length > 1" class="text-[#000000CC] text-bold text-base">
          {{ t("promotion.select_currency") }}
        </div>
        <div v-else class="text-[$000000CC] text-bold text-base">{{ t("promotion.congratulations") }}</div>
        <q-btn
          class="absolute top-0 right-0 text-[$000000CC]"
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
        <div
          class="bg-[#7676801F] rounded-full w-[9.3125rem] h-[2.5rem] px-[.625rem] mb-2 flex items-center justify-end"
        >
          <q-select
            v-model="selectedIndex"
            :options="
              giftsList[0].options.map((option, index) => ({
                label: option.currency_code,
                value: index
              }))
            "
            class="w-3/5 border-none bg-transparent text-[#000000CC]"
            dropdown-icon="expand_more"
            map-options
            emit-value
            dense
            borderless
            menu-anchor="bottom end"
            menu-self="top end"
            :menu-offset="[10, 3]"
            behavior="menu"
          >
            <template #option="{ itemProps, opt, selected }">
              <q-item v-bind="itemProps" class="bg-[#EEEEEF] w-[9.3125rem]">
                <q-item-section>
                  <q-item-label class="flex items-center gap-2">
                    <q-img v-if="selected" :src="svgIcon('checked')" loading="lazy" class="w-4 h-4"></q-img>
                    <q-img v-else :src="svgIcon('checkbox')" loading="lazy" class="w-4 h-4"></q-img>
                    <span> {{ opt.label }}</span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none flex justify-center items-center text-base mt-4">
        <span class="text-[#848484]">
          {{ t("promotion.you_get") }}
          <span class="text-[#1FAB3D] mx-3">{{ moneyFormat(giftsList[0].options[selectedIndex].amount, 4) }}</span>
          <span class="font-bold">{{ currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code }}</span>
        </span>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          class="mt-4 mb-4 w-[9.3125rem] h-[2.1875rem] min-h-0 text-sm capitalize bg-[#1FAB3D] text-white"
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
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
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
const { claimGiftImg, svgIcon } = useSiteImg()

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
