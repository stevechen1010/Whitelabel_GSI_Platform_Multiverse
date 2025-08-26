<template>
  <div class="input-container">
    <q-input
      v-model="inputValue"
      v-bind="attrs"
      :rules="field.required ? [Rules.required()] : []"
      lazy-rules
      :placeholder="field.column_label"
      :disable="!field.edit"
    >
      <q-menu>
        <q-date v-model="inputValue" mask="YYYY-MM-DD" color="date" />
      </q-menu>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue"
import { useRule } from "src/common/hooks/useRule"
import { INPUT_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

const attrs = useAttrs()
const Rules = useRule()

interface Props {
  modelValue: any // 欄位為動態, 無法預先定義
  field: {
    column_name: string
    customize: boolean
    edit: boolean
    lang?: {
      [key: string]: string
    }
    required: boolean
    type: number
    values: Response.BaseListType[]
    column_label?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "", // 欄位為動態, 無法預先定義
  field: () => ({
    column_name: "",
    customize: false,
    edit: false,
    required: false,
    type: INPUT_TYPE.Enums.DATE,
    values: []
  })
})

const emit = defineEmits(["update:modelValue"])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
})
</script>
