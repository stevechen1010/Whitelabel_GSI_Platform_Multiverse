<template>
  <q-input
    v-model="inputValue"
    :rules="field.is_required ? [Rules.required()] : []"
    lazy-rules
    outlined
    class="mb-2"
    :placeholder="$t(`bank_column.${field.field_code}`)"
    v-bind="attrs"
  />
</template>

<script setup lang="ts">
import { useRule } from "src/common/hooks/useRule"
import { computed, useAttrs } from "vue"

const Rules = useRule()
const attrs = useAttrs()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  // class?: string // 當input 在不同欄位有不同樣式時, 可以透過外部給這邊class name
  field: {
    field_code: string
    field_name: string
    is_required: boolean
    type: number
    values: [] | null
  }
}

const props = defineProps<Props>()

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})
</script>

<style lang="sass" scoped></style>
