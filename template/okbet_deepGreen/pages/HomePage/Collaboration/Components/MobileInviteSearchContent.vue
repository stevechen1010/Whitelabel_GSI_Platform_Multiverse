<template>
  <div class="search-content text-base font-semibold">
    <p>{{ $t("collaboration.search_content") }}</p>
    <div class="mt-[1.125rem] mobile-form-row">
      {{ $t("collaboration.member_account") }}
      <q-input
        v-model="invitationState.query.member_account"
        filled
        dense
        :placeholder="$t('collaboration.account_number')"
      ></q-input>
    </div>
    <div class="mt-[1.75rem] flex flex-nowrap items-center justify-between">
      <div class="mobile-form-row">
        {{ $t("collaboration.status") }}
        <q-select
          v-model="invitationState.query.status"
          :options="statusDropDown"
          filled
          dense
          emit-value
          map-options
        ></q-select>
      </div>
      <div class="mobile-form-row">
        {{ $t("collaboration.currency") }}
        <q-select
          v-model="invitationState.query.currency_id"
          :options="props.walletDropdown"
          filled
          dense
          emit-value
          map-options
        ></q-select>
      </div>
    </div>
    <q-btn class="hide-hover btn-search" @click="submit">{{ $t("common.btn.search") }}</q-btn>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useInvitation } from "src/common/composables/useInvitation"
import { BaseListType } from "src/api/response.type"

const props = defineProps({
  walletDropdown: {
    type: Array<BaseListType>,
    required: true,
    default: () => []
  }
})

const { invitationState, statusDropDown, getInvitationList, initInvitationState, submit } = useInvitation()

onMounted(() => {
  initInvitationState()
  getInvitationList()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_deepGreen/assets/css/_variable.sass";

.search-content {
  color: $color-white;
}

.mobile-form-row {
  @apply flex items-center gap-4;
  .q-input {
    @apply w-[16.75rem] h-[2.375rem] rounded-lg;
    border: 1px solid $border-dark-secondary;

    :deep(.q-field__native) {
      color: $color-white;
    }

    :deep(.q-field__control) {
      @apply h-[2.375rem];
      color: $border-dark-secondary;
    }
  }
  .q-select {
    @apply w-[7.0625rem] h-[2.375rem] rounded-[2.5rem];
    border: 1px solid $border-dark-secondary;

    :deep(.q-field__control) {
      @apply h-[2.375rem] rounded-[2.5rem];

      .q-field__native {
        @apply justify-center;
        color: $color-white;
      }

      .q-field__append {
        color: $color-white;
      }
    }
  }
}
.btn-search {
  @apply mt-[1.4375rem] w-full py-[.625rem] rounded-[2.4606rem] capitalize;
  font-size: 1rem;
  background-color: $color-primary;
}
</style>
