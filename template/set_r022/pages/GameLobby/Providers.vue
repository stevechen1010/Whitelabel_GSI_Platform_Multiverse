<template>
  <div class="providers-container" :class="{ vertical: isVertical }">
    <div
      v-for="(product, key) in productState.list"
      :key="key"
      :name="product.product_code"
      class="tab-item"
      :class="{ active: productCode === product.product_code }"
      @click="handleTabClick(product.product_code)"
    >
      <img
        :src="getProductTabImage({ ...product, siteKey: 'set_r022' })"
        class="tab-image"
        :alt="product.product_name"
        @error="setDefaultProductTabImg"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useGame } from "src/common/composables/useGame"
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { GAME_TAG_TYPE } from "src/common/utils/constants"
import { SearchGameKey } from "app/template/set_r022/utils/constants/symbols"

const route = useRoute()
const router = useRouter()
const { productState, getProductTabImage } = useGame()
const { setDefaultProductTabImg } = useSiteImg()
const searchGame = inject(SearchGameKey)

defineProps({
  isVertical: {
    type: Boolean,
    default: false
  }
})

if (!searchGame) {
  throw new Error("searchGame is not provided")
}
const { handleTagClick } = searchGame

const productCode = computed(() => Number(route.params.productCode))
const gameType = computed(() => {
  return Number(route.params.gameType)
})

const handleTabClick = (productId: number) => {
  router.replace({ params: { gameType: gameType.value, productCode: productId } })

  handleTagClick(GAME_TAG_TYPE.Enums.All)
}
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.providers-container {
  @apply w-full flex flex-nowrap items-center gap-[.375rem] overflow-x-auto;

  &.vertical {
    @apply flex-col w-[3.75rem] overflow-y-auto flex-shrink-0;

    .tab-item {
      background: var(--neutral-01);

      &.active {
        border-radius: 0.5rem;
        background: var(--primary-01);
      }
    }
  }

  .tab-item {
    @apply flex items-center justify-center px-[.3125rem] py-[.625rem];
    @apply cursor-pointer;
    transition: all 0.3s ease;

    &.active {
      @apply rounded-full;
      border: 1px solid var(--primary-01);
      background: linear-gradient(180deg, var(--primary-07) 0%, var(--primary-08) 100%);
    }
  }

  .tab-image {
    @apply min-w-[3.125rem] max-h-[1.75rem] object-cover;
  }
}
</style>
