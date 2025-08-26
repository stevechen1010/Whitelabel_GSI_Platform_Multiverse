<template>
  <div class="tag-list-container">
    <q-btn
      v-for="tag in gameTagList"
      :key="`tag-${tag.value}`"
      flat
      class="hide-hover btn-tag"
      :class="{ active: searchState.tag === tag.value }"
      @click="handleTagClick(tag.value as GAME_TAG_TYPE.Enums, true)"
    >
      {{ tag.label }}
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { inject } from "vue"
import { GAME_TAG_TYPE } from "src/common/utils/constants"
import { SearchGameKey } from "app/template/set_r022/utils/constants/symbols"

const searchGame = inject(SearchGameKey)
if (!searchGame) {
  throw new Error("searchGame is not provided")
}

const { searchState, gameTagList, handleTagClick } = searchGame
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.tag-list-container {
  @apply w-full flex items-center gap-[.75rem] overflow-x-auto;

  :deep(.q-btn) {
    @apply flex-shrink-0 flex items-center justify-center py-[.5rem] px-[1.25rem] rounded-full;
    background: var(--neutral-01);
    color: var(--secondary-01);

    &.active {
      background: var(--primary-01);
      color: var(--text-01);
    }
  }
}
</style>
