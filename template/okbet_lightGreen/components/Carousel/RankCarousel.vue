<template>
  <div v-if="isMobile && rankList.length" class="w-full px-4 pt-2 pb-4">
    <div class="RankCarousel relative flex">
      <div class="icon_wrap">
        <img class="absolute bottom-0 left-2" :src="rankIcon()" alt="icon" />
      </div>
      <div class="content_wrap px-4 flex h-full flex-1 items-center">
        <q-carousel
          animated
          v-model="slide"
          :navigation="false"
          swipeable
          infinite
          :autoplay="3000"
          transition-prev="slide-right"
          transition-next="slide-left"
          transition-duration="500"
        >
          <q-carousel-slide v-for="(rank, index) in rankList" :key="index" :name="index + 1">
            <div
              class="flex w-full justify-between items-center"
              @click="openGame(rank.product_code, rank.game_code, gameTypeState.map[rank.game_type].game_type, true)"
            >
              <div class="flex items-center">
                <img
                  class="game_icon mr-2"
                  :src="getGameImage(rank)"
                  :alt="rank.game_code"
                  @error="setDefaultGameImg"
                />
                <span>{{ rank.member_account }}</span>
              </div>
              <div class="money px-3 py-1 flex items-center">
                <img class="mr-2 w-5" :src="coin_icon()" alt="icon" />
                <span class="money">
                  {{ moneyFormat(rank.prize_amount, 2) }}
                </span>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useQuasar } from "quasar"
import { useRoute } from "vue-router"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import { useApi } from "src/common/hooks/useApi"
import { getLatestWinList } from "src/api/rank"
// import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import { GAME_TYPE } from "src/common/utils/constants"
// import { EventBusKey } from "src/symbols"
// import { injectStrict } from "src/common/utils/injectTyped"
import { useGame } from "src/common/composables/useGame"

const { setDefaultGameImg } = useCommonImg()
const { coin_icon } = useSiteImg()
const { openGame, getGameImage, gameTypeState } = useGame()
const $q = useQuasar()
const isMobile = computed(() => $q.screen.width < 768)
const { moneyFormat, genEnumToArray } = useCommon()
const { rankIcon } = useSiteImg()
const route = useRoute()
// const eventbus = injectStrict(EventBusKey)

const gameType = computed(() => {
  let gameType
  try {
    const allGameTypes = genEnumToArray(GAME_TYPE.Enums)
    const currentGameType = Number(route.params.gameType)
    if (allGameTypes.includes(currentGameType)) {
      gameType = currentGameType
    }
  } catch (e: any) {
    console.warn(`rank board is not supported the game type: ${route.params.gameType}`)
  } finally {
    return gameType
  }
})

const slide = ref(1)
const rankList = ref<Response.RankItem[]>([])

async function getRankList() {
  let { status, data } = await useApi(getLatestWinList, {
    currency_id: undefined,
    game_type: gameType.value ? gameType.value : undefined
  })

  // 過濾後列表
  data = data.filter((item: Response.RankItem) => {
    return parseInt(item.prize_amount) > 1000
  })
  rankList.value = data as Response.RankItem[]
}

onMounted(async () => {
  await getRankList()
})
</script>

<style lang="scss" scoped>
.RankCarousel {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  background-image: url(../../assets/images/rankCarousel/rank_bg.png);
  background-size: cover, contain;
  background-position: 100% 100%;
  background-repeat: no-repeat, repeat;
  border: 1px solid rgba(217, 255, 197, 0.45);
  box-shadow: 0px 0px 13.9px 0px rgba(178, 255, 174, 1) inset;
}

.icon_wrap {
  height: 100%;
  width: 59px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.25) 100%);
  border-radius: 10px 0 0 10px;
  img {
    height: 48px;
  }
}

.content_wrap {
  width: 100%;
  :deep(.q-carousel) {
    width: 100%;
    height: 100%;
    background: transparent;
    color: white;
    font-weight: 600;
    font-size: 12px;
  }

  :deep(.q-carousel__slide) {
    padding: 0;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .money {
    background: rgba(0, 0, 0, 0.21);
    border-radius: 30px;
    color: rgba(253, 237, 16, 1);
    font-weight: 700;
    font-size: 14px;
    line-height: 19.07px;
    letter-spacing: 0%;
    text-align: right;
  }
}

.game_icon {
  width: 28px;
}
</style>
