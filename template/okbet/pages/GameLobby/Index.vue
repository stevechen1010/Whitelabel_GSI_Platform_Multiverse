<template>
  <GameBanner />
  <MobileNav v-if="$q.platform.is.mobile" />
  <div class="provider-container" :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <div class="provider-title">
      <p class="item-desc">{{ $t("home.entertaining") }}</p>
      <h3 class="title">
        <span> {{ $t("home.game") }} </span> {{ $t("home.providers") }}
      </h3>
    </div>
    <swiper :slides-per-view="$q.platform.is.mobile ? 2.5 : 4.3" :space-between="10">
      <swiper-slide
        v-for="(product, key) in productState.list"
        :key="key"
        :name="product.product_code"
        @click="handleTabClick(product.product_code)"
      >
        <img
          :src="getProductTabImage({ ...product, siteKey: 'okbet' })"
          class="tab-img"
          :alt="product.product_name"
          @error="setDefaultProductTabImg"
        />
      </swiper-slide>
    </swiper>
  </div>
  <div v-if="$q.platform.is.mobile" class="game-container h5">
    <div class="search-container">
      <div class="tabs">
        <q-btn
          v-for="tag in gameTagList"
          :key="`tag-${tag.value}`"
          flat
          class="hide-hover btn-tag"
          :class="{ active: searchState.tag === tag.value }"
          @click="handleTagClick(tag.value as GAME_TAG_TYPE.Enums, true)"
        >
          <q-icon :name="tag.icon" class="mr-2"></q-icon>
          {{ tag.label }}
        </q-btn>
      </div>
      <q-input
        v-model.trim="searchState.keyword"
        borderless
        clearable
        clear-icon="close"
        class="search-input"
        :placeholder="$t('placeholder.gameName')"
      >
        <template #append> <q-icon name="search" /> </template
      ></q-input>
    </div>
    <ul v-if="filterGameList.length > 0" class="game-row">
      <li
        v-for="game in filterGameList"
        :key="game.game_id"
        class="game-item"
        @click="openGame(game.product_code, game.game_code, gameTypeState.map[gameType].game_type, true)"
      >
        <div class="img-container">
          <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
          <q-btn
            v-if="gameState.favoriteMap[game.game_id]"
            class="btn-favorite hide-hover"
            round
            flat
            @click.stop="removefavoriteGame(game, true)"
          >
            <img :src="svgIcon('heart-btn-active')" alt="" />
          </q-btn>
          <q-btn v-else class="btn-favorite hide-hover" round flat @click.stop="addfavoriteGame(game, true)">
            <img :src="svgIcon('heart-btn')" alt="" />
          </q-btn>
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

        <div class="game-name">{{ game.game_name }}</div>
        <div class="game-favorites">
          <img :src="svgIcon('heart-collet')" alt="" />
          <span> {{ formatNumberKM(game.favorite_count) }} </span>
        </div>
      </li>
    </ul>
    <div v-else class="no-data-container no-data">
      <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
    <FooterNav />
  </div>
  <div v-else class="game-container pc">
    <div class="search-container">
      <div class="tabs">
        <swiper :slides-per-view="4" :space-between="16">
          <swiper-slide v-for="tag in gameTagList" :key="`tag-${tag.value}`" :name="tag.value">
            <q-btn
              flat
              class="hide-hover btn-tag"
              :class="{ active: searchState.tag === tag.value }"
              @click="handleTagClick(tag.value as GAME_TAG_TYPE.Enums, true)"
            >
              {{ tag.label }}
            </q-btn>
          </swiper-slide>
        </swiper>
      </div>
      <q-input v-model.trim="searchState.keyword" borderless class="search-input">
        <template #append> <q-icon name="search" /> </template>
      </q-input>
    </div>
    <ul v-if="filterGameList.length > 0" class="game-row">
      <li v-for="game in filterGameList" :key="game.game_id" class="game-item">
        <div class="img-container">
          <img :src="getGameImage(game)" :alt="game.game_code" class="game-img" @error="setDefaultGameImg" />
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
          <div class="play-btn-container">
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
          <span class="game-name">{{ game.game_name }}</span>
          <span class="game-favorites">
            <img :src="svgIcon('heart-collet')" alt="" />
            {{ formatNumberKM(game.favorite_count) }}
          </span>
        </div>
      </li>
    </ul>
    <div v-else class="no-data-container no-data">
      <img v-if="getWideLogo" :src="getWideLogo()" alt="" />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
    <!-- 最新得獎跑馬燈 -->
    <RankBoard class="rank-board my-8 w-full" />
    <!-- 先隱藏 -->
    <!-- <FeatureLiveCasino /> -->
  </div>
  <FooterArea v-if="!$q.platform.is.mobile" />
</template>
<script lang="ts">
export default {
  name: "GameLobby"
}
</script>
<script lang="ts" setup>
import GameBanner from "app/template/okbet/components/Banner/GameBanner.vue"
import RankBoard from "app/template/okbet/components/Carousel/RankBoard.vue"
import FooterArea from "app/template/okbet/components/Footer/Index.vue"
import MobileNav from "app/template/okbet/components/MobileNav.vue"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import { useBanner } from "src/common/composables/useBanner"
import { useGame } from "src/common/composables/useGame"
import { useSearchGame } from "src/common/composables/useSearchGame"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { BANNER_POSITION, GAME_TAG_TYPE, AI_HELPER_EVENT_ROUTES } from "src/common/utils/constants"
import "swiper/css"
import { Swiper, SwiperSlide } from "swiper/vue"
import { computed, onMounted, ref, watchEffect } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useLogo } from "src/common/composables/useLogo"
import FooterNav from "../../components/Footer/FooterNav.vue"

const route = useRoute()
const router = useRouter()
const { handleBannerList } = useBanner()
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
const { setDefaultProductTabImg, svgIcon, hotTagImg, newTagImg } = useSiteImg()
const { setDefaultGameImg } = useCommonImg()
const { formatNumberKM } = useCommon()
const { getWideLogo } = useLogo()
const { handleAIHelperRouteEvent } = useAIHelperEvent()

const gameType = computed(() => {
  return Number(route.params.gameType)
})
const productCode = ref(0)
const slide = ref(1)

function testBug() {
  const a = 1
  if (a = 2) {
    console.log("wrong condition")
  }
}

function handleTabClick(productId: number) {
  productCode.value = productId
  router.replace({ params: { gameType: gameType.value, productCode: productId } })

  handleTagClick(GAME_TAG_TYPE.Enums.All)
}

async function getBanner() {
  await handleBannerList(BANNER_POSITION.Enums.ProductLobby, gameType.value)
}

watchEffect(() => {
  if (gameTypeState.list.length && gameType.value && productCode.value) {
    getGames(gameType.value, productCode.value)
  }
})

onMounted(async () => {
  handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.GAME_LOBBY)
  await getFavoriteGames()
  await getBanner()
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

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";
@import "app/template/okbet/assets/css/game.scss";
@import "app/template/okbet/assets/css/button.scss";
@import "app/template/okbet/assets/css/data.scss";

.provider-container {
  @include setFlex;
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;

  &.pc {
    @apply w-full mb-8;

    .provider-title {
      width: 100%;
    }

    .item-desc {
      font-family: OpenSans;
      font-style: normal;
      font-weight: 860;
      font-size: 0.75rem;
      line-height: 0.875rem;
      color: rgba($text-primary-color, 0.5);
      text-transform: uppercase;
    }

    .title {
      @apply relative mb-5;
      font-family: OpenSans;
      font-style: normal;
      font-size: 1.75rem;
      line-height: 2.0625rem;
      color: $text-night-sky-color;
      font-weight: 500;

      span {
        color: $primary-color;
        font-weight: 860;
      }
    }

    .swiper {
      width: 100%;

      .swiper-slide {
        width: 260px;
        height: 100px;
        background: $background-light-color;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 auto;
        margin-left: 0;
        overflow: hidden;
        cursor: pointer;
      }

      .tab-img {
        width: 70%;
      }
    }
  }

  &.h5 {
    margin-top: 0.5rem;

    .item-desc {
      display: none;
    }

    .title {
      display: none;
    }

    .swiper {
      width: 100vw;
      @include iphone-width {
        max-width: 92vw;
      }

      .swiper-slide {
        width: auto;
        background: $background-light-color;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 auto;
        margin-left: 0;
        overflow: hidden;
        cursor: pointer;
      }

      .tab-img {
        width: 200px;
      }
    }
  }
}

.hot-tag {
  position: absolute;
  left: -5%;
  top: 5%;
  z-index: 10;

  width: 71px;
  height: 50px;

  @media (max-width: 767px) {
    // Adjustments for iPhone width or similar small screens
    width: 50px;
    height: 35px;
    left: -7%;
    top: 3%;
  }
}

.game-container {
  @include setFlex;
  flex-direction: column;

  &.pc {
    margin: 2rem 2rem 8rem 2rem;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;

    .search-container {
      width: 100%;
      @apply flex justify-end pr-5;

      .tabs {
        width: 100%;
        display: flex;
        flex: 1 1 0%;
        margin-bottom: 20px;
        margin-right: 20px;
        overflow-x: auto;
        border-radius: 16px;
        padding-bottom: 4px;

        .swiper {
          margin: 0;

          .swiper-slide {
            width: auto !important;

            .btn-tag {
              padding: 10px 20px;
              border-radius: 100px;
              font-family: OpenSans;
              font-style: normal;
              font-weight: 400;
              font-size: 16px;
              line-height: 19px;
              margin-left: 0px;
              background: $background-light-color;
              color: $text-steel-blue-color;
              white-space: nowrap;
              flex: 0 0 auto;
              text-transform: none;

              &.active {
                font-weight: 510;
                color: $text-light-color;
                background: $primary-color;
              }
            }
          }
        }
      }

      .search-input {
        width: 13.75rem;
        height: 2.5rem;
        border-radius: 2.125rem;
        background: $background-light-color;

        :deep(.q-field__control) {
          height: 2.5rem;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          font-weight: 400;
          font-size: 1rem;
          line-height: 1.4375em;
          letter-spacing: 0.00938em;
          color: rgba($text-dark-color, 0.87);
          box-sizing: border-box;
          cursor: text;
          display: inline-flex;
          align-items: center;
          position: relative;
          border-radius: 4px;
          padding-right: 0.875rem;

          input {
            color: $text-sky-gray-color;
            font-family: OpenSans;
            font-style: normal;
            font-weight: 400;
            font-size: 1rem;
            line-height: 1.1875rem;
            padding-left: 1.25rem;
          }

          .q-icon {
            color: $text-sky-gray-color;
          }
        }
      }
    }

    .game-row {
      width: 100%;
      @apply grid grid-cols-6 gap-4;

      .hot-tag {
        position: absolute;
        left: -5%;
        top: 9%;
        z-index: 10;
        width: 71px;
        height: 50px;
      }

      @include pc-2xl-width {
        @apply grid-cols-5;
      }

      @include pc-xl-width {
        @apply grid-cols-4;
      }
    }
  }

  &.h5 {
    padding-bottom: 7rem;

    .search-container {
      width: 100%;
      margin: 0.4rem;
      @apply px-4 rounded-lg overflow-hidden flex justify-center items-center flex-wrap;

      .tabs {
        width: 100%;
        display: flex;
        overflow-x: auto;
        border-radius: 0.5rem;
        margin-bottom: 0.4rem;
        justify-content: space-between;

        .btn-tag {
          @apply rounded-lg;
          width: 23.5%;
          padding: 5px 0;
          font-family: OpenSans;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 19px;
          margin-left: 0px;
          background: $background-light-color;
          color: $text-steel-blue-color;
          white-space: nowrap;
          flex: 0 0 auto;
          text-transform: none;

          &.active {
            font-weight: 510;
            color: $text-light-color;
            background: $primary-color;
          }
        }
      }

      .search-input {
        @apply w-full h-9 px-2 rounded-lg;
        background: $background-light-color;

        :deep(.q-field__control) {
          @apply h-9;
        }

        :deep(.q-field__marginal) {
          @apply h-9;

          .q-field__focusable-action {
            font-size: 14px;
            font-weight: bold;
            margin-right: 6px;
            color: $text-midnight-ocean-color;
            opacity: 1;
          }
        }
      }
    }

    .game-row {
      @apply w-full px-4;
      @apply flex flex-wrap;

      .hot-tag {
        width: 50px;
        height: 35px;
        left: -7%;
        top: 9%;
        position: absolute;
        z-index: 10;
      }

      .game-item {
        @apply w-full h-auto pb-3 rounded-lg;

        .img-container {
          @apply h-auto rounded-lg;

          img {
            @apply rounded-lg;
          }
        }

        .game-name {
          @apply mt-2;
          // display: -webkit-box;
          // -webkit-box-orient: vertical;
          // -webkit-line-clamp: 2;
          // overflow: hidden;
          // white-space: unset;
          // height: auto;
        }

        .game-favorites {
          img {
            @apply w-5 h-5;
          }
        }
      }

      @include iphone-width {
        @apply grid grid-cols-3 gap-2;
      }
    }
  }
}
</style>
