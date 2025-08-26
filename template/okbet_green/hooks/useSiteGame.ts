import { computed } from "vue"
import { storeToRefs } from "pinia"
import moduleName from "src/stores/"
import { useGameTypeStore } from "src/stores/gameTypeStore"
import { useProductStore } from "src/stores/productStore"
import { useGame } from "src/common/composables/useGame"
import { GAME_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

export function useSiteGame() {
  const gameTypeStore = useGameTypeStore()
  const productStore = useProductStore()

  const { gameTypeState } = storeToRefs(gameTypeStore)
  const { productState } = storeToRefs(productStore)

  // hotfix 隱藏的產品
  const hiddenProducts = [
    {
      // CASINO-JILI
      gameType: GAME_TYPE.Enums.LIVECASINO,
      productCode: 1091
    },
    {
      // OTHER-JDB
      gameType: GAME_TYPE.Enums.OTHER,
      productCode: 1085
    }
  ]

  const filterProducts = (gameType: GAME_TYPE.Enums, data: Response.ProductList) =>
    data.filter((item) => !hiddenProducts.some((p) => p.gameType === gameType && p.productCode === item.product_code))

  const siteProductList = computed(() => {
    if (gameTypeState.value.using) {
      return [...filterProducts(gameTypeState.value.using, productState.value.list)]
    }

    return productState.value.list
  })

  return {
    siteProductList
  }
}
