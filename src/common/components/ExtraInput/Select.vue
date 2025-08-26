<template>
  <q-select
    v-model="inputValue"
    :options="field.values || []"
    emit-value
    map-options
    outlined
    lazy-rules
    clearable
    behavior="menu"
    use-input
    hide-selected
    fill-input
    dense
    input-style="caret-color: transparent"
    :placeholder="$t(`bank_column.${field.field_code}`)"
    :rules="[Rules.requiredInt]"
    v-bind="attrs"
  >
    <template v-slot:option="scope" v-if="props.optionStyle">
      <q-item v-bind="scope.itemProps" :class="props.optionStyle">
        <q-item-section>
          <q-item-label :class="props.optionStyle">{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
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
    values: []
  }
  optionStyle: string
}

const props = withDefaults(defineProps<Props>(), {
  optionStyle: () => ""
})

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: number) => emit("update:modelValue", value)
})
</script>
