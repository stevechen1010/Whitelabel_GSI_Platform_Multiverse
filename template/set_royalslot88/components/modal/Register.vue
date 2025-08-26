<template>
  <ModalBase v-model="modalShow" modal-class="modal_share_custom" use-title :title="$t('common.btn.register')">
    <PhoneRegisterForm v-if="isPhoneRegisterMode" />
    <AccountRegisterForm v-else />
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useEnv } from "src/common/hooks/useEnv"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

import ModalBase from "./modalBase.vue"
import PhoneRegisterForm from "../Form/PhoneRegister.vue"
import AccountRegisterForm from "../Form/AccountRegister.vue"

const { isPhoneRegisterMode } = useEnv()

const eventbus = injectStrict(EventBusKey)
const modalShow = ref(false)

onMounted(() => {
  eventbus.on("openRegister", (show: boolean) => {
    modalShow.value = show
  })
})
</script>

<style scoped lang="scss"></style>
