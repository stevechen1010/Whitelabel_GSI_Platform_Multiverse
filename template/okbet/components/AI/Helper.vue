<template>
  <template v-if="isAIHelperShow">
    <div class="ai-helper-content" :class="{ active: isAIHelperIframeShow }" v-draggable>
      <div class="ai-helper-top">
        <q-img :src="svgIcon('close-black')" loading="lazy" class="btn-close" @click="closeAIHelper"></q-img>
      </div>
      <div class="ai-helper-middle" @click="isAIHelperIframeShow = !isAIHelperIframeShow">
        <!-- <div class="spinner">
          <div class="spinner1"></div>
        </div> -->
        <q-img :src="aiIcon('helper2')" loading="lazy" class="ai-img"></q-img>
      </div>
      <div class="ai-helper-bottom">
        <span class="ai-name">AI {{ $t("menu.sales_assistant") }}</span>
      </div>
    </div>
    <div class="iframe-content" :class="{ active: isAIHelperIframeShow }">
      <q-btn class="absolute top-0 right-0" flat rounded size="lg" @click="isAIHelperIframeShow = false">X</q-btn>
      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        ref="aiHelperIframeRef"
        allow="camera; microphone"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
      ></iframe>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useAIHelperEvent } from "src/common/hooks/useAIHelperEvent"
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"

const { svgIcon, aiIcon } = useSiteImg()
const { iframeOrigin, iframeUrl, isAIHelperShow, isAIHelperIframeShow, aiHelperIframeRef, closeAIHelper } =
  useAIHelperEvent()

onMounted(() => {
  iframeOrigin.value = "https://assistancebot.gpsriowdl.com"
  iframeUrl.value = "https://assistancebot.gpsriowdl.com/assistant.html"
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.ai-helper-content {
  @apply fixed;
  width: 7.25rem;
  z-index: 10002;
  top: 100px;
  left: calc(100vw - 8.25rem);

  .ai-helper-top {
    @apply flex justify-end items-center;
    .btn-close {
      @apply w-6 h-6 cursor-pointer;
    }
  }

  .ai-helper-middle {
    @apply relative cursor-pointer flex justify-center;
    width: 7.25rem;
    height: 14.7188rem;

    .spinner {
      position: absolute;
      left: 0.5rem;
      bottom: 0;

      background-image: linear-gradient(rgb(186, 66, 255) 35%, rgb(0, 225, 255));
      width: 100px;
      height: 100px;
      animation: spinning 1.7s linear infinite;
      text-align: center;
      border-radius: 50px;
      filter: blur(1px);
      box-shadow: 0px -5px 20px 0px rgb(186, 66, 255), 0px 5px 20px 0px rgb(0, 225, 255);

      .spinner1 {
        background-color: rgb(36, 36, 36);
        width: 100px;
        height: 100px;
        border-radius: 50px;
        filter: blur(10px);
      }

      @keyframes spinning {
        to {
          transform: rotate(360deg);
        }
      }
    }

    .ai-img {
      position: absolute;
      bottom: 0;
      left: 0;
      animation: floatUpDown 2.5s ease-in-out infinite;
    }

    @keyframes floatUpDown {
      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-10px); /* 向上移動 10px */
      }
    }
  }

  .ai-helper-bottom {
    @apply flex justify-center items-center relative z-10;

    .ai-name {
      padding: 0.25rem 0.75rem;
      background: #000;
      border-radius: 62.4375rem;
      font-family: NotoSans;
      font-weight: 700;
      font-size: 0.875rem;
      line-height: 1.1875rem;
      color: #fff;
      white-space: nowrap;
    }
  }

  &.active {
    visibility: hidden;
  }
}

.iframe-content {
  @apply fixed;
  width: 30.1875rem;
  height: 37.5rem;
  max-width: 90vw;
  max-height: 81vh !important;
  z-index: 10001;
  top: 50%;
  right: 0;
  transform: translate(100%, -50%);
  transition: transform 0.3s ease;

  &.active {
    transform: translate(0%, -50%);
  }

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
