<template>
  <div class="outer-layout" :class="`${devicePlatform}`">
    <router-view />
  </div>
</template>

<script setup>
import "animate.css"
import useSwipeLeft from "src/common/hooks/useSwipeLeft"
import { onMounted } from "vue";
const devicePlatform = window.device?.platform || ""
useSwipeLeft(devicePlatform)

onMounted(() => {
  console.log("[Init URL]: ", window.location.href);
})

</script>

<style lang="sass">
.outer-layout
  position: relative

</style>
