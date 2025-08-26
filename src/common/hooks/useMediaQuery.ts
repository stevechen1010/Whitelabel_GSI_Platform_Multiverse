import { ref, computed, onMounted, onUnmounted } from "vue"

export function useMediaQuery() {
  const width = ref(window.innerWidth)

  const onResize = () => {
    width.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener("resize", onResize)
  })

  onUnmounted(() => {
    window.removeEventListener("resize", onResize)
  })

  const isMobile = computed(() => width.value <= 768)
  const isDesktop = computed(() => !isMobile.value)
  const isLargeTablet = computed(() => width.value <= 1000)

  return {
    width,
    isMobile,
    isDesktop,
    isLargeTablet
  }
}
