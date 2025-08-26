<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <!-- login -->
    <q-form
      v-if="type === MODAL_TYPE.Enums.Login"
      @submit="isPhoneRegisterMode ? showVerifyModal([handleLoginSms]) : showVerifyModal([login])"
    >
      <!-- 手機號碼欄位 -->
      <div v-if="isPhoneRegisterMode">
        <h2 class="form-title mb-2">
          {{ $t("member.login.phoneFormTitle") }}
        </h2>
        <h3 class="form-subtitle" v-if="formLogin.login_method === LOGIN_METHOD.Enums.Sms">
          {{ $t("member.login.phoneFormSubtitle") }}
        </h3>
        <div class="form-container">
          <q-input
            v-model="formLogin.phone"
            ref="phoneRef"
            class="form-input"
            dense
            outlined
            :placeholder="$t('member.login.phone')"
            lazy-rules
            :rules="[Rules.required()]"
            inputmode="numeric"
            @update:model-value="(val) => handlePhoneInput(val as string)"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('people')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
          </q-input>
          <!-- 密碼欄位 -->
          <q-input
            v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
            v-model="formLogin.password"
            class="form-input"
            dense
            outlined
            :placeholder="$t('placeholder.pleaseEnterPassword')"
            lazy-rules
            :rules="[Rules.required()]"
            :type="showPassword ? 'text' : 'password'"
          >
            <template #prepend>
              <div class="divider-error"></div>
              <div class="form-icon">
                <img :src="svgIcon('password')" alt="phone-number" />
              </div>
              <div class="divider"></div>
            </template>
            <template #append>
              <q-icon
                class="eye-icon"
                :name="showPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <!-- SMS -->
          <!-- <div class="sms-container" v-else>
            <q-input
              v-model="formLogin.sms_otp"
              class="form-input"
              dense
              borderless
              :placeholder="$t('member.login.verifyCode')"
              lazy-rules
              :rules="[Rules.required()]"
            >
              <template #prepend>
                <div class="divider-error"></div>
                <div class="form-icon">
                  <img :src="svgIcon('shield')" alt="verify-code" />
                </div>
                <div class="divider"></div>
              </template>
            </q-input>
            <q-btn v-if="counting" class="btn-send counting hide-hover" flat borderless disable>
              <vue-countdown @end="counting = false" :time="90000" v-slot="{ totalSeconds }" class="counting-text">
                {{ `${totalSeconds}S` }}
              </vue-countdown>
            </q-btn>
            <q-btn
              v-else
              color="primary"
              class="btn-send hide-hover"
              :label="$t('common.btn.send')"
              @click="getOtpCode"
              :disable="isLoading || !formLogin.phone"
            />
          </div> -->
        </div>
      </div>
      <!-- 帳號欄位 -->
      <div class="form-container" v-else>
        <p class="input-label">{{ $t("placeholder.pleaseEnterUsername") }}</p>
        <q-input
          v-model="formLogin.username"
          class="form-input"
          dense
          outlined
          :placeholder="$t('placeholder.pleaseEnterUsername')"
          lazy-rules
          :rules="[Rules.required()]"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('people')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
        </q-input>

        <p class="input-label">{{ $t("placeholder.pleaseEnterPassword") }}</p>
        <q-input
          v-model="formLogin.password"
          class="form-input"
          dense
          outlined
          :placeholder="$t('placeholder.pleaseEnterPassword')"
          lazy-rules
          :rules="[Rules.required()]"
          :type="showPassword ? 'text' : 'password'"
        >
          <template #prepend>
            <div class="divider-error"></div>
            <div class="form-icon">
              <img :src="svgIcon('password')" alt="phone-number" />
            </div>
            <div class="divider"></div>
          </template>
          <template #append>
            <q-icon
              class="eye-icon"
              :name="showPassword ? 'visibility' : 'visibility_off'"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </div>
      <!-- 忘記密碼 -->
      <!-- <div class="forgot-container">
        <q-btn flat text-color="primary" class="hide-hover" :disable="isLoading" @click="goForgotPassword">
          {{ $t("member.forgotPassword.forgotPassword") }}
        </q-btn>
      </div> -->
      <!-- 登入按鈕 -->
      <q-btn color="primary" class="btn-submit mt-5 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.login") }}
        {{ `${isSmsLogin ? " / " + $t("common.btn.register") : ""} ` }}
      </q-btn>
      <!-- 註冊按鈕 -->
      <!-- <div v-if="!isSmsLogin" class="btn-password-container mt-3">
        <q-btn
          flat
          text-color="primary"
          class="btn-password hide-hover"
          @click="changeDialog(false)"
          :disable="isLoading"
        >
          {{ $t("common.btn.register") }}
        </q-btn>
      </div> -->
      <!-- 切換帳號、手機 btn -->
      <div class="btn-password-container mt-3" v-if="isPhoneRegisterMode">
        <q-btn
          v-if="formLogin.login_method === LOGIN_METHOD.Enums.Password"
          flat
          text-color="primary"
          class="btn-password hide-hover"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Sms)"
          :disable="isLoading"
        >
          {{ $t("common.btn.smsLogin") }}
        </q-btn>
        <q-btn
          v-else
          flat
          text-color="primary"
          class="btn-password hide-hover"
          @click="changeLoginMethod(LOGIN_METHOD.Enums.Password)"
          :disable="isLoading"
        >
          {{ $t("common.btn.passwordLogin") }}
        </q-btn>
      </div>
    </q-form>
    <!-- register -->
    <q-form v-if="type === MODAL_TYPE.Enums.Register" @submit="showVerifyModal([register])">
      <div class="form-container" v-if="customInputList.length !== 0">
        <!-- CMS欄位 -->
        <PhoneInput
          v-model:phone="formRegister.phone"
          v-model:country="formRegister.country"
          :disable="phoneColumnDisable"
        ></PhoneInput>
        <template v-for="(column, key) in customInputList" :key="key">
          <!-- 文字輸入框 -->
          <!-- <SmsOtpInput
            v-if="column.column_name === 'sms_otp'"
            :field="column"
            :phone="formRegister?.phone"
            :class="'form-input'"
            v-model="(formRegister as Request.register)[column?.column_name]"
          ></SmsOtpInput> -->
          <ExtraInput
            v-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Input"
            :field="column"
            v-model="(formRegister as Request.register)[column?.column_name]"
          ></ExtraInput>

          <!-- 下拉選單類型 -->
          <ExtraSelect
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Select"
            v-model="(formRegister as Request.register)[column?.column_name]"
            :field="column"
          ></ExtraSelect>
          <DateInput
            v-else-if="excludeColumn(column.column_name) && column.type === FIELD_TYPE.Enums.Date"
            :field="column"
            v-model="(formRegister as Request.register)[column?.column_name]"
          ></DateInput>
        </template>
      </div>
      <q-btn color="primary" class="btn-submit mt-1 hide-hover" type="submit" :loading="isLoading">
        {{ $t("common.btn.register") }}
      </q-btn>
      <!-- <div class="btn-password-container mt-2">
        <q-btn
          flat
          text-color="primary"
          class="btn-password hide-hover"
          @click="changeDialog(true)"
          :disable="isLoading"
        >
          {{ $t("common.btn.login") }}
        </q-btn>
      </div> -->
    </q-form>
  </div>
  <VerificationCode
    v-model="loginOtpDialog"
    @show="getOtpCode(SMS_OTP_TYPE.Enums.Login)"
    @complete-input="handleLoginOtpDialogComplete"
  />
  <VerificationCode
    v-model="registerOtpDialog"
    @show="getOtpCode(SMS_OTP_TYPE.Enums.Register)"
    @complete-input="handleRegisterOtpDialogComplete"
  />
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useQuasar } from "quasar"
import * as Request from "src/api/request.type"
import * as Response from "src/api/response.type"
import VerificationCode from "src/common/components/modal/VerificationCode.vue"
import { useGame } from "src/common/composables/useGame"
import { useLanguage } from "src/common/composables/useLanguage"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import { useRule } from "src/common/hooks/useRule"
import { useSlideVerify } from "src/common/hooks/useSlideVerify"
import {
  COLUMN_NAME,
  ERROR_CODE_TYPE,
  FIELD_TYPE,
  LOGIN_METHOD,
  MODAL_TYPE,
  SMS_OTP_TYPE
} from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted, reactive, ref } from "vue"
import { useI18n } from "vue-i18n"
import DateInput from "../../components/ExtraInput/Date.vue"
import ExtraInput from "../../components/ExtraInput/Index.vue"
import PhoneInput from "../../components/ExtraInput/Phone.vue"
import ExtraSelect from "../../components/ExtraInput/Select.vue"

const props = defineProps(["type"])
const $q = useQuasar()
const { t } = useI18n()
const Rules = useRule()
const { isPhoneRegisterMode, companyName } = useEnv()
const {
  isLoading,
  handleGetOTP,
  hiddenColumn,
  handleRegisterCustomInput,
  handleLogin,
  handleRegister,
  auth,
  handleCheckPhone
} = useAuth()
const { getUserWalletList, getUserInfo2 } = useUserInfo()
const { getFavoriteGames } = useGame()
const { svgIcon } = useSiteImg()
const { showVerifyModal } = useSlideVerify()
const { nowLang } = useLanguage()
const eventbus = injectStrict(EventBusKey)
const { handleOpenLiveChat } = useLiveChat()

const isSmsLogin = computed(() => isPhoneRegisterMode.value && formLogin.login_method === LOGIN_METHOD.Enums.Sms)

const isLoginMode = ref(true)
const counting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loginOtpDialog = ref(false)
const registerOtpDialog = ref(false)
const phoneColumnDisable = ref(false)

// 排除特殊墜欄位
const excludeColumn = (columnName: string) => {
  switch (columnName) {
    case "phone":
    case "country":
    case "sms_otp":
      return false

    default:
      return true
  }
}

const customInputList = ref<Response.RegistInputCustomList>([])

const formLogin = reactive<Request.login>({
  login_method: LOGIN_METHOD.Enums.Password,
  username: "", // 密碼用
  password: "", // 密碼用
  phone: "", // 手機用
  sms_otp: "" // 手機用
})

const formRegister = ref<Request.register>({
  is_customize: true
})

function handlePhoneInput(val: string) {
  formLogin.phone = val.replace(/[^0-9]/g, "")
}

// 切換 登入/註冊 模式
function changeDialog(status: boolean) {
  isLoginMode.value = status
  showPassword.value = false
  showConfirmPassword.value = false
  formLogin.username = ""
  formLogin.password = ""
  formLogin.sms_otp = ""
  formRegister.value = {
    is_customize: true
  }

  if (status) {
    formLogin.phone = ""
    phoneColumnDisable.value = false
  }
}

// 切換手機登入時  - password/otp 模式
function changeLoginMethod(type: LOGIN_METHOD.Enums) {
  formLogin.login_method = type
  formLogin.username = ""
  formLogin.password = ""
  formLogin.phone = ""
  formLogin.sms_otp = ""
}

async function register() {
  const { status } = await handleRegister(formRegister.value)

  if (!status) {
    return
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.registerSuccess"),
    position: "top",
    timeout: 1000
  })

  if (isPhoneRegisterMode.value) {
    formLogin.phone = formRegister.value.phone
    formLogin.sms_otp = formRegister.value.sms_otp
    await loginSms()
  } else {
    formLogin.username = formRegister.value.account
    formLogin.password = formRegister.value.password
    await login()
  }
}

async function getOtpCode(request_type: SMS_OTP_TYPE.Enums) {
  // phoneRef.value.validate()
  // if (phoneRef.value.hasError) {
  //   return $q.notify({
  //     type: "negative",
  //     message: t("common.validate.verificationError"),
  //     position: "top"
  //   })
  // }
  counting.value = true
  const payload: Request.GetOTP = {
    phone_number: formLogin.phone as string,
    request_type
  }
  const { status } = await handleGetOTP(payload)
  if (status) {
    $q.notify({
      type: "positive",
      message: t("common.alarm.createSuccess"),
      position: "top"
    })
  }
}

async function handleLoginSms() {
  // 手機模式下，使用密碼登入
  if (formLogin.login_method === LOGIN_METHOD.Enums.Password) {
    formLogin.username = formLogin.phone
    login()
    return
  }

  const checkPhonePayload: Request.CheckPhone = {
    phone_number: formLogin.phone as string
  }

  const { code } = await handleCheckPhone(checkPhonePayload)

  if (code === ERROR_CODE_TYPE.Enums.PHONE_EXIST) {
    loginOtpDialog.value = true
    return
  }

  registerOtpDialog.value = true
}

function handleLoginOtpDialogComplete(verificationCode: string) {
  formLogin.sms_otp = verificationCode
  loginSms()
}

function handleRegisterOtpDialogComplete(verificationCode: string) {
  registerOtpDialog.value = false
  changeDialog(false)

  if (customInputList.value.find((e) => e.column_name === COLUMN_NAME.Enums.PHONE)) {
    formRegister.value.phone = formLogin.phone
    phoneColumnDisable.value = true
  }
  if (customInputList.value.find((e) => e.column_name === COLUMN_NAME.Enums.SMS_OTP)) {
    formRegister.value.sms_otp = verificationCode
  }
}

async function loginSms() {
  const payload: Request.login = {
    login_method: LOGIN_METHOD.Enums.Sms,
    username: formLogin.phone,
    sms_otp: formLogin.sms_otp
  }
  const { status } = await handleLogin(payload)
  if (!status) {
    return
  }
  await loginAfter()
}

async function loginAfter() {
  if (auth.value.access_token) {
    await getFavoriteGames()
    await getUserWalletList()
    await getUserInfo2()
    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000
    })
  }
  eventbus.emit("openLogin", false)
  loginOtpDialog.value = false
  registerOtpDialog.value = false

  if (auth.value.need_update_profile === true) {
    eventbus.emit("openUpdateProfile", true)
  }
}

async function login() {
  const { status, data } = await handleLogin({
    login_method: LOGIN_METHOD.Enums.Password,
    username: formLogin.username,
    password: formLogin.password
  })

  if (!status) {
    return
  }

  if (auth.value.access_token) {
    await getFavoriteGames()
    await getUserWalletList()
    await getUserInfo2()
    $q.notify({
      type: "positive",
      message: t("common.alarm.loginSuccess"),
      position: "top",
      timeout: 1000
    })
  }
  eventbus.emit("openLogin", false)

  if (auth.value.need_update_profile === true) {
    eventbus.emit("openUpdateProfile", true)
  }
}

function goForgotPassword() {
  eventbus.emit("openForgotPassword", true)
  eventbus.emit("openLogin", false)
}

onMounted(async () => {
  if (isPhoneRegisterMode.value) {
    changeLoginMethod(LOGIN_METHOD.Enums.Sms)
  }
  const { data } = await handleRegisterCustomInput({ type: "register" })
  customInputList.value = data || []

  changeDialog(props.type)
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/form.scss";
@import "app/template/set_r017/assets/css/button.scss";

.pc {
  .form-title {
    font-size: 1rem;
    color: $primany01;
    font-weight: 700;
    overflow-wrap: break-word;
    line-height: normal;
    letter-spacing: normal;
  }
  .form-container {
    .input-label {
      color: $neutral01;
      font-size: 0.8rem;
    }
  }
  .form-input {
    ::v-deep(.q-field__inner) {
      height: fit-content;
      border-radius: 4px;
      border: 2px solid $neutral04;
      background: $secondary06;
      /* input陰影 */
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
      .q-field__native {
        color: $neutral01;
      }
    }
  }

  .form-subtitle {
    margin: 0.3125rem 0 0.625rem;
    font-size: 0.875rem;
    color: $primany01;
    font-weight: 400;
    overflow-wrap: break-word;
    line-height: normal;
  }
  .sms-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .form-input {
      width: 18.875rem;
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin-top: 0.1875rem;
    }
  }
  .btn-submit {
    border: none;
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
    border-radius: 0.5rem;
    color: $primany01;
    height: 2.5rem;
    width: 100%;
    position: relative;
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn-password {
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      text-transform: none;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
    }
  }
  .form-bottom {
    padding-top: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.h5 {
  .form-title {
    font-family: Helvetica;
    text-align: center;
    color: $primany01;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 1.5625rem;
    margin-bottom: 0.5rem;
  }
  .form-input {
    padding: 0.5rem 0.75rem 0.5rem;
    ::v-deep(.q-field__inner) {
      height: fit-content;
      border-radius: 4px;
      border: 2px solid $neutral04;
      background: $secondary06;
      /* input陰影 */
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
      .q-field__native {
        color: $neutral01;
      }
    }
  }
  .form-subtitle {
    font-weight: 200;
    font-size: 0.9647rem;
    line-height: 1;
    text-transform: capitalize;
    color: $primany01;
    text-align: center;
    min-height: 1.375rem;
  }
  .sms-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .form-input {
      width: 15.5rem;
    }
    .btn-send {
      margin-left: 0.5rem;
      width: 5.625rem;
      height: 2.5rem;
      margin: 0.1875rem 1rem 0 1rem;
    }
  }
  .form-container {
    margin: 0.6875rem auto;
    box-shadow: rgba($primany01, 0.06) 0px 0.4375rem 0.6875rem;
    border-radius: 0.5rem;
    padding-bottom: 0.625rem;
    .input-label {
      padding: 0rem 0.75rem 0rem;
      color: $neutral01;
      font-size: 0.8rem;
    }
  }
  .btn-submit {
    height: 60px;
    width: calc(100% - 1.5rem);
    display: flex;
    margin: 0 auto 2rem;
    font-family: inherit;
    font-size: 1.1026rem;
    margin-top: 0.6875rem;
    border-radius: 4px;
    background: linear-gradient(90deg, $primany01 0%, $primany02 100%), #b7906d;
    // background: linear-gradient(90deg, $primany01 0%, $primany01 100%) !important;
    text-align: center;
    border: none;
    text-transform: capitalize;
    &.disabled {
      opacity: 0.5 !important;
    }
  }
  .btn-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.0625rem;
    margin-bottom: 1rem;
    .btn-password {
      font-weight: 400;
      font-size: 0.9647rem;
      overflow-wrap: break-word;
      text-transform: none;
      padding: 0;
      min-height: auto;
    }
  }
  .forgot-container {
    display: flex;
    justify-content: flex-end;
    .q-btn {
      text-transform: capitalize;
      font-weight: 400;
      font-size: 0.875rem;
      overflow-wrap: break-word;
      padding: 0;
      min-height: auto;
    }
  }
  .form-bottom {
    width: 100%;
    margin-top: 1rem;
    color: $primany01;
    border-radius: 16px;
    border: 0.5px solid $primany01;
    backdrop-filter: blur(20px);
  }
}

.form-icon {
  img {
    filter: brightness(0) invert(1);
  }
}
</style>
