<template>
  <div v-if="$q.platform.is.mobile" class="banner-container">
    <q-carousel
      v-if="bannerList.length"
      class="h5"
      animated
      v-model="slide"
      navigation
      swipeable
      infinite
      :autoplay="3000"
      transition-prev="slide-right"
      transition-next="slide-left"
      transition-duration="500"
    >
      <q-carousel-slide
        v-for="(banner, index) in bannerList"
        :key="index"
        :name="index + 1"
        @click="handleBannerRedirect(banner)"
      >
        <img :src="getBannerImage(banner)" alt="banner" class="banner-img" draggable="false" />
      </q-carousel-slide>
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>
  <div v-else class="banner-container">
    <q-carousel
      v-if="bannerList.length"
      class="pc"
      animated
      v-model="slide"
      navigation
      swipeable
      infinite
      :autoplay="3000"
      transition-prev="slide-right"
      transition-next="slide-left"
      transition-duration="500"
    >
      <q-carousel-slide
        class="slide-pagination"
        v-for="(banner, index) in bannerList"
        :key="index"
        :name="index + 1"
        @click="handleBannerRedirect(banner)"
      >
        <img :src="getBannerImage(banner)" alt="banner" draggable="false" />
      </q-carousel-slide>
      <template v-slot:navigation-icon="{ active, onClick }">
        <div class="line-pagination" :class="{ active: active }" @click="onClick"></div>
      </template>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { useBanner } from "src/common/composables/useBanner"
import { ref } from "vue"
import "vue3-carousel/dist/carousel.css"
const { bannerList, handleBannerRedirect, getBannerImage } = useBanner()

const slide = ref(1)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

$pagination-height: 0.375rem;
$pagination-rounded: 0.625rem;

.q-carousel {
  &.pc {
    width: 100%;
    .q-carousel__slide {
      @apply w-full h-full cursor-pointer;
      padding: 0;

      img {
        width: 100%;
      }
    }

    .line-pagination {
      @apply mx-1 relative opacity-100;
      width: 3.75rem;
      height: $pagination-height;
      border-radius: $pagination-rounded;
      background: rgba(#000, 0.3);

      &::after {
        content: "";
        transition: width 2.5s linear;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 0px;
        height: $pagination-height;
        border-radius: $pagination-rounded;
      }

      &.active {
        &::after {
          background: $primany01;
          width: 100%;
        }
      }
    }
  }

  &.h5 {
    @apply h-auto relative;
    width: 100%;
    background-color: transparent;

    .q-carousel__slide {
      @apply w-full h-full rounded-lg p-0;
      background-size: cover;
      background-repeat: no-repeat;

      .banner-img {
        @apply w-full h-auto rounded-lg bg-cover bg-center;
      }
    }

    :deep(.q-carousel__navigation-inner) {
      justify-content: flex-end;

      .line-pagination {
        @apply mx-1 opacity-100;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.75rem;
        background: rgba(#000, 0.4);

        &.active {
          width: 1.5rem;
          background: $primany01;
        }

        @include phone-width {
          width: 0.375rem;
          height: 0.375rem;

          &.active {
            width: 0.75rem;
          }
        }
      }
    }
  }
}

.banner-container {
  position: relative;
  width: 100%;
  max-width: 75rem;
  margin: 0 auto;

  @include phone-width {
    padding: 0 0.875rem;
  }

  :deep(.q-carousel) {
    height: auto;
    border-radius: 4px;
    box-shadow: 0px 0px 30px 0px #ff8181;
    background: transparent;
  }

  :deep(.q-carousel__control) {
    bottom: 4vw;
  }
}
</style>
