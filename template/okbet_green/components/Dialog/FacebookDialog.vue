<template>
  <!-- 臨時需求，新增Facebook通知彈窗 -->
  <q-dialog
    v-model="facebookAlertDialog"
    persistent
    transition-show="fade"
    transition-hide="fade"
    class="facebook-alert-dialog"
  >
    <q-card class="facebook-alert-card">
      <q-card-section class="row items-center q-pa-none">
        <q-btn class="btn-close" icon="close" flat round dense v-close-popup />
        <img :src="facebookAlertImg" alt="facebook-alert" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"

const { facebookAlertImg } = useSiteImg()
const facebookAlertDialog = ref(false)

function handleFacebookAlertClick() {
  window.location.href = "https://www.facebook.com/FairplayPHofficial"
  window.open("https://www.facebook.com/FairplayPHofficial", "_system")
}

onMounted(() => {
  facebookAlertDialog.value = true
})
</script>

<style lang="sass" scoped>
.facebook-alert-dialog
  position: relative

  .facebook-alert-card
    border-radius: 0.75rem

  .btn-close
    position: absolute
    top: 0.0625rem
    right: 0.0625rem
</style>
