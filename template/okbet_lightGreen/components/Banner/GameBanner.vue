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
      :autoplay="5000"
      transition-prev="slide-right"
      transition-next="slide-left"
      transition-duration="500"
    >
      <q-carousel-slide
        v-for="(banner, index) in bannerList"
        :key="index"
        :name="index + 1"
        :img-src="getBannerImage(banner)"
        @click="handleBannerRedirect(banner)"
      />
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
@import "app/template/okbet_green/assets/css/_variable.sass";

$pagination-height: 0.375rem;
$pagination-rounded: 0.625rem;

.q-carousel {
  @apply bg-transparent;
  &.pc {
    @apply mt-5 mb-10 w-full h-auto;

    .q-carousel__slide {
      @apply w-full h-full cursor-pointer;
      height: 23.75rem;
      border-radius: 1.375rem;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }

    .line-pagination {
      @apply mx-1 relative opacity-100;
      width: 3.75rem;
      height: $pagination-height;
      border-radius: $pagination-rounded;
      background-color: rgba($color: #000000, $alpha: 0.3);

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
          background-color: $bg-secondary;
          width: 100%;
        }
      }
    }
  }

  &.h5 {
    @apply h-auto relative;
    width: calc(100vw - 1rem);
    margin: 0rem auto 1.25rem;

    .q-carousel__slide {
      @apply w-full h-full rounded-lg p-0;
      background-size: cover;
      background-repeat: no-repeat;

      .banner-img {
        @apply w-full aspect-[404/176] h-auto rounded-lg bg-cover bg-center;
      }
    }

    :deep(.q-carousel__navigation-inner) {
      justify-content: flex-end;

      .line-pagination {
        @apply mx-1 opacity-100;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.75rem;
        background-color: #ffffffc9;

        &.active {
          width: 1.5rem;
          background-color: $text-light-primary;
        }

        @include iphone-width {
          width: 0.5206rem;
          height: 0.5206rem;

          &.active {
            width: 3.5162rem;
            border-radius: 65.0463rem;
          }
        }
      }
    }
  }
}

.banner-container {
  max-width: 1200px;
  margin: 0 auto;

  @include iphone-width {
    margin: 0;
  }
}
</style>
