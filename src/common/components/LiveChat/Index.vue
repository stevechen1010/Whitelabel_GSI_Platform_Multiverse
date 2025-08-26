<template>
  <div ref="htmlContainer" v-html="htmlContent"></div>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useLiveChat } from "src/common/hooks/useLiveChat"

const { htmlContent, htmlContainer, enableConfig, injectHtml } = useLiveChat()

watchEffect(() => {
  if (enableConfig.value) {
    injectHtml()
  }
})
</script>
