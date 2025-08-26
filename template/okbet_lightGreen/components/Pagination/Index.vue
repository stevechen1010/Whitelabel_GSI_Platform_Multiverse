<template>
  <q-pagination
    :model-value="modelValue"
    :max="totalPages"
    :max-pages="maxPages"
    direction-links
    @update:model-value="$emit('update:model-value', $event)"
    class="pagination-wrapper"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number
  totalPages: number
  maxPages?: number
}>()

defineEmits<{
  "update:model-value": [value: number]
}>()
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";

.pagination-wrapper {
  :deep(.q-btn) {
    color: $color-white !important;

    &::before {
      box-shadow: none;
    }
  }

  :deep(.q-btn--active) {
    background: $color-primary !important;
  }

  :deep(.bg-primary) {
    background: transparent !important;
    color: $color-primary !important;
  }
}
</style>
