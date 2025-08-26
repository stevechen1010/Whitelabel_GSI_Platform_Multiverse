<template>
  <GameBanner />
  <div class="game-lobby-wrapper" :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`" @click="handleWrapperClick">
    <q-input
      v-model.trim="searchState.keyword"
      borderless
      class="game-search-input"
      :placeholder="$t('placeholder.searchGame')"
    >
      <template #prepend>
        <q-img :src="svgIcon('game-search')" loading="lazy" class="icon-style w-5 h-5"></q-img>
      </template>
    </q-input>
    <div class="game-filter-item">
      <div class="filter-box">
        <q-img :src="svgIcon('filter')" loading="lazy" class="icon-style w-5 h-5"></q-img>
        <span>{{ $t("common.filter_label") }}</span>
        <q-select
          outlined
          v-model="productCode"
          :options="productCodeOption"
          class="custom-select"
          color="white"
          :popup-content-style="{
            backgroundColor: '#1d125d',
            color: '#fff'
          }"
          emit-value
          map-options
        />
      </div>
      <div class="filter-box">
        <q-img :src="svgIcon('filter')" loading="lazy" class="icon-style w-5 h-5"></q-img>
        <span>{{ $t("common.filter_label") }}</span>
        <q-select
          outlined
          v-model="gameTag"
          :options="gameTagList"
          class="custom-select"
          emit-value
          map-options
          color="white"
          :popup-content-style="{
            backgroundColor: '#1d125d',
            color: '#fff'
          }"
        />
      </div>
    </div>
    <div class="game-tab scrollX mb-[1.25rem]">
      <GameTab />
    </div>
    <ul v-if="filterGameList.length > 0" class="game-row">
      <li v-for="game in filterGameList" :key="game.game_id" class="game-item">
        <div class="img-container">
          <img
            :src="getGameImage(game)"
            :alt="game.game_code"
            class="game-img"
            @error="setDefaultGameImg"
            @click="handleGameClick(game.game_id, $event)"
          />
          <!-- 已經收藏平常就要顯示 -->
          <q-btn
            v-if="gameState.favoriteMap[game.game_id]"
            class="btn-favorite hide-hover"
            round
            flat
            @click="removefavoriteGame(game, true)"
          >
            <img :src="svgIcon('heart-btn-active')" alt="" />
          </q-btn>
          <div class="play-btn-container" :class="{ show: selectedGameId === game.game_id && !isDesktop }">
            <q-btn
              class="btn-play hide-hover"
              @click="openGame(game.product_code, game.game_code, gameTypeState.map[gameType].game_type, true)"
            >
              {{ $t("game.play_now") }}
            </q-btn>
            <!-- 還沒收藏，hover才顯示 -->
            <q-btn
              v-if="!gameState.favoriteMap[game.game_id]"
              class="btn-favorite hide-hover"
              round
              flat
              @click="addfavoriteGame(game, true)"
            >
              <img :src="svgIcon('heart-btn')" alt="" />
            </q-btn>
          </div>
        </div>

        <img
          v-if="
            ((game.hot === 1 && game.newly === 1) || (game.hot === 1 && game.newly === 0)) &&
            searchState.tag !== GAME_TAG_TYPE.Enums.New
          "
          :src="hotTagImg"
          class="hot-tag"
        />
        <img
          v-else-if="(game.hot === 0 && game.newly === 1) || searchState.tag === GAME_TAG_TYPE.Enums.New"
          :src="newTagImg"
          class="hot-tag"
        />
        <div class="title-container">
          <div class="game-name">{{ game.game_name }}</div>
          <!-- <span class="game-favorites">
            <img :src="svgIcon('heart-collet')" alt="" />
            {{ formatNumberKM(game.favorite_count) }}
          </span> -->
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import GameBanner from "app/template/set_r017/components/Banner/GameBanner.vue"
import GameTab from "app/template/set_r017/components/Tab/GameTab.vue"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useGame } from "src/common/composables/useGame"
import { useSearchGame } from "src/common/composables/useSearchGame"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { AI_HELPER_EVENT_ROUTES, GAME_TAG_TYPE } from "src/common/utils/constants"
import { computed, onMounted, ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const route = useRoute()
const router = useRouter()
const {
  gameTypeState,
  productState,
  gameState,
  getProducts,
  getGames,
  openGame,
  addfavoriteGame,
  removefavoriteGame,
  getFavoriteGames,
  getGameImage,
  getProductTabImage
} = useGame()
const { gameTagList, searchState, filterGameList, handleTagClick } = useSearchGame()
const { setDefaultGameImg } = useCommonImg()
const { formatNumberKM } = useCommon()
const { isDesktop } = useMediaQuery()
const { svgIcon, hotTagImg, newTagImg } = useSiteImg()
const { handleAIHelperRouteEvent } = useAIHelperEvent()

const gameType = computed(() => {
  return Number(route.params.gameType)
})

const productCode = ref(0)
const gameTag = ref(0)
const selectedGameId = ref<number | null>(null)

const productCodeOption = computed(() => {
  return productState.list.map((item) => ({
    label: item.product_name,
    value: item.product_code
  }))
})

function handleTabClick(productId: number) {
  productCode.value = productId
  router.replace({ params: { gameType: gameType.value, productCode: productId } })

  handleTagClick(GAME_TAG_TYPE.Enums.All)
}

const handleGameClick = (gameId: number, event: Event) => {
  // 阻止事件冒泡，避免觸發外層的點擊事件
  event.stopPropagation()

  // 在手機版時，點擊遊戲圖片來切換按鈕顯示
  if (!isDesktop.value) {
    selectedGameId.value = selectedGameId.value === gameId ? null : gameId
  }
}

const handleWrapperClick = (event: Event) => {
  // 如果點擊的是遊戲圖片或按鈕區域，不隱藏
  const target = event.target as HTMLElement
  if (target.closest(".img-container")) {
    return
  }
  // 點擊其他地方時隱藏已選中的遊戲按鈕
  selectedGameId.value = null
}

watchEffect(() => {
  if (productCode.value) {
    router.replace({
      params: { gameType: gameType.value, productCode: productCode.value },
      query: route.query
    })
    handleTagClick(GAME_TAG_TYPE.Enums.All)
  }

  if (gameTag.value) {
    handleTagClick(gameTag.value)
  }

  if (gameTypeState.list.length && gameType.value && productCode.value) {
    getGames(gameType.value, productCode.value)
  }

  if (gameTypeState.list.length && gameType.value && gameTag.value) {
    getGames(gameType.value, productCode.value)
  }
})

onMounted(async () => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.GAME_LOBBY)
  await getFavoriteGames()
  await getProducts(gameType.value)

  const routeProductCode = Number(route.params.productCode)
  if (routeProductCode) {
    productCode.value = routeProductCode
    return
  }

  if (productState.list.length) {
    handleTabClick(productState.list[0].product_code)
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/form.scss";
@import "app/template/set_r017/assets/css/common.scss";
@import "app/template/set_r017/assets/css/game.scss";
@import "app/template/set_r017/assets/css/button.scss";

// select 共用樣式
.custom-select {
  background-color: #1b0059;
  border-radius: 6px;
  color: white;
  height: 40px;
  display: flex;
  align-items: center;

  :deep(.q-field__control) {
    height: 40px;
    min-height: 40px;
    padding: 0 10px;
    font-size: 14px;
    color: white;
    display: flex;
    align-items: center;
    border-radius: 4px;
    border: 2px solid $neutral04;
    background: $secondary06;
    /* input陰影 */
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  }

  :deep(.q-field__append) {
    height: 40px;
    min-height: 40px;
  }

  :deep(.q-field__native),
  :deep(.q-placeholder) {
    line-height: 40px;
    min-height: 40px;
    height: 40px;
    color: white;
    span {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  :deep(.q-select__dropdown-icon) {
    color: white;
  }
}

.game-banner-wrapper {
  width: 100%;
  :deep(.game-banner-content) {
    width: 70vw;
    height: auto;
    max-width: 75rem;
    @include phone-width {
      width: 90%;
    }
  }
}

.game-lobby-wrapper {
  width: 100%;
  height: auto;
  max-width: 75rem;
  margin: 1.5rem auto 1.5rem;
  @include phone-width {
    width: 90%;
  }

  .game-banner-content {
    margin: 1.5rem auto 1.5rem;
  }

  .game-search-input {
    border-radius: 999px;
    border: 1px solid #454545;
    background: #0a0a0a;
    margin-bottom: 2rem;
    :deep(.q-field__inner) {
      padding: 0 1rem;
      .q-field__prepend {
        filter: brightness(0) invert(1);
      }
      .q-field__native {
        color: $neutral01;
      }
    }
  }
}

.game-filter-item {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .filter-box {
    color: $neutral01;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    span {
      margin: 0 0.5rem;
    }

    @include phone-width {
      padding: 0;
      span {
        display: none;
      }
      :deep(.q-img) {
        display: none;
      }
    }
  }
}

.game-row {
  width: 100%;
  @apply grid grid-cols-6 gap-6;

  .hot-tag {
    position: absolute;
    left: -8%;
    top: 3%;
    z-index: 10;
    width: 71px;
    height: auto;
  }

  @include phone-width {
    @apply grid-cols-3;
    gap: 1rem;

    .hot-tag {
      left: -6%;
    }
  }

  .title-container {
    @include phone-width {
      width: 100%;
      text-align: center;
      margin-top: 0.375rem;
    }

    .game-name {
      @include phone-width {
        padding: 0;
      }
    }
  }
}
</style>
