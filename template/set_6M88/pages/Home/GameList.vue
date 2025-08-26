<template>
  <div class="menu-tab">
    <div class="menu-list">
      <a
        v-for="item in gameTypeState.list"
        :key="item.id"
        :class="{ active: item.id === gameTypeId }"
        @click="changeTab(item.id)"
      >
        <img class="link-img" :src="menuTabImg(item.frontendKey, item.id === gameTypeId ? true : false)" alt="" />
        <span>{{ item.label ? gameListName(item.label) : "" }}</span>
      </a>
    </div>
    <div class="menu-content">
      <a
        v-for="product in productState.list"
        :key="product.product_name"
        class="menu-prod"
        @click="handleProductClick(product.product_code)"
      >
        <img
          :src="getProductSquareImage({ ...product, siteKey: 'set_6M88' })"
          :alt="product.product_name"
          @error="setDefaultProductImg"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_6M88/hooks/useSiteImg"
import { useGame } from "src/common/composables/useGame"
import { useInit } from "src/common/composables/useInit"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const { initialize } = useInit()
const { gameTypeState, getProducts, productState, handleProductClick, getProductSquareImage } = useGame()
const { setDefaultProductImg } = useCommonImg()
const { menuTabImg } = useSiteImg()

const gameTypeId = ref(0)
const { result } = useSiteImg()
const initializeGame = async () => {
  await initialize()
  if (gameTypeState.list.length > 0) {
    gameTypeId.value = gameTypeState.list[0].id
    getProducts(gameTypeId.value)
  }
}

const changeTab = (id: number) => {
  if (gameTypeId.value !== id) {
    gameTypeId.value = id
    getProducts(id)
  }
}

const gameListName = (label: string) => {
  /// https://www.notion.so/wowgaming/deab66cbc9df439abca3031becdd1308?pvs=4
  /// 根據以上 issue 修正，需求只需要去除mobile上 live 字樣，故此處用判斷去除
  let translated = t(label)

  if (translated.toLowerCase().includes("casino")) {
    translated = translated.replace("Live ", "")
  }

  return translated
}

watch(
  () => gameTypeState.list,
  (newList) => {
    if (newList.length > 0 && gameTypeId.value === 0) {
      gameTypeId.value = newList[0].id
      getProducts(gameTypeId.value)
    }
  },
  { immediate: true }
)

onMounted(() => {
  initializeGame()
})
</script>
