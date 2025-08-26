<template>
  <div class="management-area">
    <div class="page-title">
      <span class="page-title-blue">{{ $t("member.membershipManagement.subMember") }}</span>
      <span>{{ $t("member.membershipManagement.management") }}</span>
    </div>

    <div class="top-item">
      <q-tabs
        v-model="activeTab"
        class="tabs-area"
        indicator-color="transparent"
        align="left"
        @update:model-value="handlerChangeActiveTab"
      >
        <q-tab name="manage" :label="$t('menu.membershipManagement')" class="tab-item left" />
        <q-tab name="detail" :label="$t('menu.memberChangeDetails')" class="tab-item" />
      </q-tabs>

      <div v-if="activeTab === 'manage'" class="flex flex-col justify-between">
        <div class="referral-code-area">
          <div class="mb-1">{{ $t("collaboration.exclusive_referral_code") }}</div>
          <q-input class="referral-code-value" v-model="referralCode" dense :borderless="true" readonly>
            <template v-slot:append>
              <q-icon
                name="share"
                @click="copyMessage(referralCode)"
                class="cursor-pointer hover:opacity-50 code-icon left"
                size="xs"
              />
              <q-icon
                name="content_copy"
                class="cursor-pointer hover:opacity-50 code-icon right"
                size="xs"
                @click="copyMessage(referralCode)"
              />
            </template>
          </q-input>
        </div>
        <span class="text-md font-semibold mt-4"
          >{{ `${$t("collaboration.remaining_agent_amount")}：` }}
          <span class="text-[#025be8] text-2xl font-semibold">{{ `${moneyFormat(remainQuotaAmount)}` }}</span></span
        >
      </div>
    </div>

    <q-tab-panels v-model="activeTab" class="bg-transparent">
      <q-tab-panel name="manage" class="manage-panel">
        <!-- pc data -->
        <q-table
          v-if="!isMobile"
          table-class="bg-white"
          table-header-class="bg-white"
          :rows="manageRows"
          :rows-per-page-options="[size]"
          :columns="manageColumns"
          row-key="id"
          hide-pagination
          wrap-cells
          class="manage-table"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template #body="props">
            <q-tr>
              <q-td key="member_account" :props="props">
                <span>{{ props.row.member_account }}</span>
              </q-td>
              <q-td key="register_date" :props="props">
                <span>{{ parseDate(props.row.register_date) }}</span>
              </q-td>
              <q-td key="last_login_date" :props="props">
                <span>{{ parseDate(props.row.last_login_date) }}</span>
              </q-td>
              <q-td key="balance" :props="props">
                <span>{{ moneyFormat(props.row.balance) }}</span>
              </q-td>
              <q-td key="remain_quota_amount" :props="props">
                <span>{{ moneyFormat(props.row.remain_quota_amount) }}</span>
              </q-td>
              <q-td key="actions" :props="props">
                <span
                  class="text-[#0295E8] cursor-pointer mr-4"
                  @click="
                    handlerClickOperation(
                      props.row.member_account,
                      MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add,
                      props.row.is_member_agent
                    )
                  "
                >
                  {{ $t("common.btn.addAmount") }}
                </span>
                <span
                  class="text-[#0295E8] cursor-pointer"
                  @click="
                    handlerClickOperation(
                      props.row.member_account,
                      MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Minus,
                      props.row.is_member_agent
                    )
                  "
                >
                  {{ $t("common.btn.minusAmount") }}
                </span>
              </q-td>
            </q-tr>
          </template>
          <template #no-data>
            <span>{{ $t("tableHeader.no_data") }}</span>
          </template>
        </q-table>

        <!-- mobile data -->
        <div v-else class="expansion-menu">
          <q-list v-if="manageRows.length">
            <q-expansion-item
              v-for="(data, index) in manageRows"
              :key="index"
              dense
              dense-toggle
              expand-separator
              expand-icon="keyboard_arrow_down"
              class="expansion-item"
            >
              <template v-slot:header>
                <q-item-section class="expansion-header">
                  <div class="expansion-header-top">
                    <div class="mb-2.5 w-1/2">
                      <div>{{ $t("menu.account") }}</div>
                      <div class="text-gray">{{ data.member_account }}</div>
                    </div>
                    <div class="mb-2.5 w-1/2">
                      <div>
                        <span>{{ $t("common.btn.point") }}</span>
                      </div>
                      <div class="text-gray">{{ moneyFormat(data.balance) }}</div>
                    </div>
                  </div>
                  <div class="expansion-header-bottom flex !flex-row">
                    <div class="flex flex-col items-start justify-center w-1/2">
                      <div>{{ $t("tableHeader.operating") }}</div>
                      <div class="font-bold text-xs mt-1.5">
                        <span
                          class="operating-btn mr-[1.875rem]"
                          @click="
                            handlerClickOperation(
                              data.member_account,
                              MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add,
                              data.is_member_agent
                            )
                          "
                        >
                          {{ $t("common.btn.addAmount") }}
                        </span>
                        <span
                          class="operating-btn"
                          @click="
                            handlerClickOperation(
                              data.member_account,
                              MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Minus,
                              data.is_member_agent
                            )
                          "
                        >
                          {{ $t("common.btn.minusAmount") }}
                        </span>
                      </div>
                    </div>
                    <div class="mb-2.5 w-1/2">
                      <div>
                        <span>{{ $t("tableHeader.balance") }}</span>
                      </div>
                      <div class="text-gray">
                        <span>{{ moneyFormat(data.remain_quota_amount) }}</span>
                      </div>
                    </div>
                  </div>
                </q-item-section>
              </template>

              <q-card>
                <q-card-section class="!bg-[#5C8CF0] !p-5">
                  <div class="expansion-detail">
                    <div class="expansion-detail-item">
                      <span>{{ $t("tableHeader.registerTime") }}</span>
                      <span class="text-right">{{ parseDate(data.register_date) }}</span>
                    </div>
                    <div class="expansion-detail-item">
                      <span>{{ $t("tableHeader.lastLoginTime") }}</span>
                      <span class="text-right">{{ parseDate(data.last_login_date) }}</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <div v-else class="q-expansion-item flex justify-center items-center !bg-white !mb-0">
            <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
          </div>
        </div>

        <!-- pagination -->
        <div v-if="totalPage" class="pagination">
          <q-pagination
            v-model="page"
            :max="totalPage"
            @update:model-value="handleChangePage"
            direction-links
            flat
            active-design="flat"
            color="deep-grey"
            active-color="blue-8"
            icon-prev="chevron_left"
            icon-next="chevron_right"
          />
        </div>
      </q-tab-panel>

      <q-tab-panel name="detail" class="detail-panel">
        <!-- pc data -->
        <q-table
          v-if="!isMobile"
          table-class="bg-white"
          table-header-class="bg-white"
          :rows="detailRows"
          :rows-per-page-options="[size]"
          :columns="detailColumns"
          row-key="id"
          hide-pagination
          wrap-cells
          class="detail-table"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template #top>
            <q-form @submit.prevent="handlerSearchAccountAmount" class="search-form">
              <div class="search-form-row first">
                <div class="search-item">
                  <div class="search-item-label">{{ $t("member.profile.date") }}</div>
                  <q-input
                    v-model="formattedDateRange"
                    :placeholder="$t('placeholder.pleaseSelectDate')"
                    readonly
                    dense
                    standout="bg-grey-10 text-white"
                    class="search-item-input date border-b-gray-300 border-b"
                  >
                    <template v-slot:append>
                      <q-icon :name="datePickerShow ? 'arrow_drop_up' : 'arrow_drop_down'" class="cursor-pointer" />
                    </template>
                    <q-menu ref="menuRef" @show="datePickerShow = true" @hide="datePickerShow = false">
                      <q-date
                        v-model="dateRange"
                        mask="YYYY-MM-DD"
                        range
                        color="primary"
                        minimal
                        @range-end="hideMenu"
                      />
                    </q-menu>
                  </q-input>
                </div>
              </div>

              <div class="search-form-row">
                <div class="search-item">
                  <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
                  <q-input
                    v-model="memberAccount"
                    :placeholder="$t('placeholder.pleaseEnterUserAccount')"
                    dense
                    standout="text-black"
                    class="search-item-input account"
                  />
                </div>

                <div class="search-item">
                  <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
                  <q-select
                    v-model="changeType"
                    :options="changeTypeOptions"
                    :placeholder="$t('shareholder_platform.please_select')"
                    dense
                    emit-value
                    map-options
                    standout="text-black"
                    class="search-item-input type"
                  />
                </div>

                <div xs="12" sm="2" class="search-btn-area">
                  <q-btn
                    :label="$t('common.btn.search')"
                    text-color="white"
                    unelevated
                    class="search-btn"
                    type="submit"
                  />
                </div>
              </div>
            </q-form>
          </template>

          <template #body="props">
            <q-tr>
              <q-td key="member_account" :props="props">
                <span>{{ props.row.member_account }}</span>
              </q-td>
              <q-td key="updated_at_unix" :props="props">
                <span>{{ parseDate(props.row.updated_at_unix) }}</span>
              </q-td>
              <q-td key="action_type" :props="props">
                <span>{{ searchTypeName(props.row.action_type) }}</span>
              </q-td>
              <q-td key="transaction_code" :props="props">
                <span>{{ props.row.transaction_code }}</span>
              </q-td>
              <q-td key="amount" :props="props">
                <span>{{ moneyFormat(props.row.amount) }}</span>
              </q-td>
              <q-td key="before_balance" :props="props">
                <span>{{ moneyFormat(props.row.before_balance) }}</span>
              </q-td>
              <q-td key="after_balance" :props="props">
                <span>{{ moneyFormat(props.row.after_balance) }}</span>
              </q-td>
            </q-tr>
          </template>
          <template #no-data>
            <span>{{ $t("tableHeader.no_data") }}</span>
          </template>
        </q-table>

        <!-- mobile data -->
        <div v-else class="expansion-menu">
          <q-form @submit.prevent="handlerSearchAccountAmount" class="search-form">
            <div class="search-form-row first">
              <div class="search-item">
                <div class="search-item-label !text-[#5E6D78]">{{ $t("tableHeader.startDate") }}</div>
                <q-input
                  v-model="formattedStartDate"
                  :placeholder="$t('placeholder.pleaseSelectDate')"
                  readonly
                  outlined
                  standout="bg-grey-10 text-white"
                  class="search-item-input date"
                >
                  <template v-slot:append>
                    <q-icon name="calendar_month" />
                  </template>
                  <q-menu ref="menuRef" @show="datePickerShow = true" @hide="datePickerShow = false">
                    <q-date v-model="dateRange.from" mask="YYYY-MM-DD" color="primary" minimal />
                  </q-menu>
                </q-input>
              </div>
              <div class="search-item">
                <div class="search-item-label !text-[#5E6D78]">{{ $t("tableHeader.endDate") }}</div>
                <q-input
                  v-model="formattedEndDate"
                  :placeholder="$t('placeholder.pleaseSelectDate')"
                  readonly
                  outlined
                  standout="bg-grey-10 text-white"
                  class="search-item-input date"
                >
                  <template v-slot:append>
                    <q-icon name="calendar_month" />
                  </template>
                  <q-menu ref="menuRef" @show="datePickerShow = true" @hide="datePickerShow = false">
                    <q-date v-model="dateRange.to" mask="YYYY-MM-DD" color="primary" minimal />
                  </q-menu>
                </q-input>
              </div>
            </div>

            <div class="search-form-row">
              <div class="search-item">
                <div class="search-item-label">{{ $t("menu.userAccount") }}</div>
                <q-input
                  v-model="memberAccount"
                  :placeholder="$t('placeholder.pleaseEnterUserAccount')"
                  dense
                  standout="text-black"
                  class="search-item-input account"
                />
              </div>

              <div class="search-item">
                <div class="search-item-label">{{ $t("placeholder.pleaseSelectChangeType") }}</div>
                <q-select
                  v-model="changeType"
                  :options="changeTypeOptions"
                  :placeholder="$t('shareholder_platform.please_select')"
                  dense
                  emit-value
                  map-options
                  standout="text-black"
                  class="search-item-input type"
                />
              </div>

              <div xs="12" sm="2" class="search-btn-area">
                <q-btn
                  :label="$t('common.btn.search')"
                  text-color="white"
                  unelevated
                  class="search-btn"
                  type="submit"
                />
              </div>
            </div>
          </q-form>
          <q-list v-if="detailRows.length">
            <q-expansion-item
              v-for="(data, index) in detailRows"
              :key="index"
              dense
              dense-toggle
              expand-separator
              expand-icon="keyboard_arrow_down"
              class="expansion-item"
            >
              <template v-slot:header>
                <q-item-section class="expansion-header">
                  <div class="expansion-header-top">
                    <div class="mb-2.5 w-1/2">
                      <div>{{ $t("menu.account") }}</div>
                      <div class="text-gray">{{ data.member_account }}</div>
                    </div>
                    <div class="mb-2.5 w-1/2">
                      <div>{{ $t("tableHeader.accountType") }}</div>
                      <div class="text-gray">{{ searchTypeName(data.action_type) }}</div>
                    </div>
                  </div>
                  <div class="expansion-header-bottom">
                    <div>{{ $t("tableHeader.amount") }}</div>
                    <div class="text-gray">{{ moneyFormat(data.amount) }}</div>
                  </div>
                </q-item-section>
              </template>

              <q-card>
                <q-card-section class="!bg-[#5C8CF0] !p-5">
                  <div class="expansion-detail">
                    <div class="expansion-detail-item">
                      <div class="mb-1">{{ $t("tableHeader.accountChangeTime") }}</div>
                      <div class="text-right">{{ parseDate(data.updated_at_unix) }}</div>
                    </div>
                    <div class="expansion-detail-item">
                      <div class="mb-1">{{ $t("tableHeader.accountVariableObject") }}</div>
                      <div class="text-right">{{ data.transaction_code }}</div>
                    </div>
                    <div class="expansion-detail-item">
                      <div class="mb-1">{{ $t("tableHeader.amountBeforeChanges") }}</div>
                      <div class="text-right">{{ moneyFormat(data.before_balance) }}</div>
                    </div>
                    <div class="expansion-detail-item">
                      <div class="mb-1">{{ $t("tableHeader.amountAfterChange") }}</div>
                      <div class="text-right">{{ moneyFormat(data.after_balance) }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <div v-else class="q-expansion-item flex justify-center items-center !bg-white !mb-0">
            <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
          </div>
        </div>

        <!-- pagination -->
        <div v-if="totalPage" class="pagination">
          <q-pagination
            v-model="page"
            :max="totalPage"
            @update:model-value="handleChangePage"
            direction-links
            flat
            active-design="flat"
            color="deep-grey"
            active-color="blue-8"
            icon-prev="chevron_left"
            icon-next="chevron_right"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="showDialog" persistent>
      <q-card class="amount-dialog">
        <q-card-section class="amount-dialog-header">
          <div>
            {{
              dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                ? $t("member.membershipManagement.agentAddition")
                : $t("member.membershipManagement.agentDeduction")
            }}
          </div>
          <q-btn icon="close" flat round dense @click="showDialog = false" size="md" />
        </q-card-section>

        <q-card-section class="amount-dialog-content">
          <div class="account">
            <span class="mr-2.5">{{ $t("menu.userAccount") }}</span>
            <span class="text-[#2773EC] text-base font-normal">
              {{ targetAccount }}
            </span>
          </div>

          <div class="mb-1">
            {{
              dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                ? $t("member.membershipManagement.addAmount")
                : $t("member.membershipManagement.minusAmount")
            }}
          </div>
          <q-select
            class="amount increase-item mb-5"
            outlined
            dense
            v-model="dialogIncreaseItem"
            emit-value
            map-options
            :options="dialogIncreaseItemOptions"
          />

          <div class="mb-1">
            {{
              dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                ? $t("member.membershipManagement.addAmount")
                : $t("member.membershipManagement.minusAmount")
            }}
          </div>
          <q-input
            v-model="dialogAmount"
            :placeholder="$t('ai.enter_amount')"
            outlined
            dense
            class="amount"
            @update:model-value="onInputChange"
          />

          <div class="flex items-center justify-start my-[0.90625rem]">
            <div class="mr-2.5">
              {{
                dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                  ? $t("member.membershipManagement.agentAddRemainingAmount")
                  : $t("member.membershipManagement.agentMinusRemainingAmount")
              }}
            </div>

            <span class="text-[#2773EC] text-lg font-semibold">{{ moneyFormat(remainQuotaAmount) }}</span>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="amount-dialog-actions">
          <q-btn :label="$t('common.btn.submit')" class="confirm-btn" @click="handlerClickSubmit()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { onMounted, computed } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { MEMBER_AGENT_QUOTA_BALANCE_TYPE } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useMemberManagement } from "src/common/composables/useMemberManagement"
import { useRouter } from "vue-router"
import { useEnv } from "src/common/hooks/useEnv"

const { t } = useI18n()
const router = useRouter()
const { isCredit } = useEnv()
const { userInfo2 } = useUserInfo()
const { isMobile } = useMediaQuery()
const { copyMessage, moneyFormat } = useCommon()
const {
  activeTab,
  menuRef,
  datePickerShow,
  referralCode,
  page,
  size,
  totalPage,
  showDialog,
  remainQuotaAmount,
  dialogType,
  targetAccount,
  dialogAmount,
  dialogMemberIsAgent,
  dialogIncreaseItem,
  dialogIncreaseItemOptions,
  memberAccount,
  dateRange,
  formattedStartDate,
  formattedEndDate,
  changeType,
  manageRows,
  detailRows,
  changeTypeOptions,
  manageColumns,
  detailColumns,
  hideMenu,
  handlerChangeActiveTab,
  onInputChange,
  searchTypeName,
  parseDate,
  handleChangePage,
  handlerSearchAccountAmount,
  handlerClickOperation,
  handlerClickSubmit,
  handlerGetMemberAgentQuotaBalance,
  handlerGetMemberAgentQuotaAmount
} = useMemberManagement()

const formattedDateRange = computed(() => {
  if (typeof dateRange.value === "string") {
    if (dateRange.value === "") return ""
    return `${dateRange.value} 00:00:00 ${t("common.btn.to")} ${dateRange.value} 23:59:59`
  } else {
    if (!dateRange.value.from || !dateRange.value.to) return ""
    return `${dateRange.value.from} 00:00:00 ${t("common.btn.to")} ${dateRange.value.to} 23:59:59`
  }
})

onMounted(async () => {
  if (!isCredit.value || !userInfo2.value.is_member_agent) {
    return router.push({ name: "home" })
  }
  await handlerGetMemberAgentQuotaAmount()
  await handlerGetMemberAgentQuotaBalance()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/okbet/assets/css/_variable.sass";
@import "app/template/okbet/assets/css/menu.sass";

.management-area {
  width: 100%;
  max-width: 71.875rem;
  margin: auto;

  @include phone-width {
    padding: 4.4375rem 1rem 20%;
  }

  .page-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.75rem;
    font-weight: 800;
    margin-top: 3.75rem;
    margin-bottom: 2.5rem;
    color: black;

    @include phone-width {
      margin-top: 0;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      color: #2f3c55;
      font-size: 1rem;
    }

    .page-title-blue {
      color: #025be8;

      @include phone-width {
        color: #2f3c55;
      }
    }
  }

  .top-item {
    width: 100%;
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 1.25rem;

    @include phone-width {
      margin-bottom: 1.25rem;
    }

    .tabs-area {
      width: 100%;

      .tab-item {
        border-radius: 6.25rem;
        background-color: $background-pale-silver-color;
        padding: 0.625rem 1.25rem;
        font-weight: 500;
        font-size: 1rem;
        white-space: pre-wrap;
        color: rgba(0, 0, 0, 0.5);

        @include phone-width {
          padding: 0.625rem 1.25rem;
          flex: none;
          font-size: 0.75rem;
        }

        :deep(.q-tab__content) {
          @include phone-width {
            padding: 0;
          }

          .q-tab__label {
            line-height: normal;
          }
        }

        &.left {
          margin-right: 1.25rem;

          @include phone-width {
            margin-right: 0.75rem;
          }
        }

        &.q-tab--active {
          background: $primary-color;
          color: $text-light-color;
        }
      }
    }

    .referral-code-area {
      width: 34.375rem;
      height: 10.8125rem;
      color: #000000;
      border: 1px solid #025be8;
      border-radius: 0.625rem;
      background-color: #e6effd;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 1.25rem 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      @include phone-width {
        width: 100%;
        height: auto;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 1.8125rem 0 0;
        padding: 1.25rem 1.34375rem;
      }

      .referral-code-value {
        width: 18.75rem;
        height: 3rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 0.25rem;
        background-color: #5c8cf0;

        @include phone-width {
          width: 100%;
          height: 2.25rem;
        }

        .code-icon {
          color: #ffffff;

          &.left {
            margin-right: 0.625rem;
          }

          &.right {
            margin-right: 0.8125rem;

            @include phone-width {
              margin-right: 0.625rem;
            }
          }
        }

        :deep(.q-field__control) {
          width: 100%;
          height: 100%;
        }

        :deep(.q-field__append) {
          height: 100%;
        }

        :deep(.q-field__native) {
          color: #ffffff;
          padding: 0.75rem 0.8125rem;
          font-size: 1rem;
          font-weight: 600;

          @include phone-width {
            padding: 0.625rem;
          }
        }
      }
    }
  }

  .manage-panel,
  .detail-panel {
    width: 100%;
    padding: 1.25rem;
    border-radius: 0.625rem;
    overflow: hidden;
    background: white;

    @include phone-width {
      padding: 0.625rem;
    }

    .manage-table,
    .detail-table {
      width: 100%;
      box-shadow: none;
      border-radius: 0;
    }

    .search-form {
      width: 100%;

      @include phone-width {
        margin-bottom: 1.25rem;
      }

      .search-form-row {
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        margin-bottom: 1.25rem;

        @include phone-width {
          flex-direction: column;
          align-items: center;
          margin-bottom: 0;
        }

        .search-item {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.25rem;
          font-size: 0.875rem;
          overflow: hidden;

          @include phone-width {
            width: 100%;
            margin-right: 0;
            margin-bottom: 1.25rem;
            flex-direction: column;
          }

          .search-item-label {
            color: black;
            font-weight: 400;
            margin-bottom: 0.25rem;
            margin-right: 0.625rem;

            @include phone-width {
              width: 100%;
              margin-bottom: 0.375rem;
              margin-right: 0;
            }
          }

          .search-item-input {
            color: black;
            background-color: #f0f1f4;
            overflow: hidden;

            @include phone-width {
              width: 100%;
            }

            &::placeholder {
              color: #797979;
            }

            &.account {
              width: 8.6875rem;
              border-radius: 0.625rem;

              @include phone-width {
                width: 100%;
              }
            }

            &.type {
              min-width: 7.5rem;
              border-radius: 6.25rem;

              @include phone-width {
                width: 100%;
              }

              :deep(.q-field__append) {
                margin-right: 0.875rem;
              }
            }

            &.date {
              min-width: 18rem;
              height: 1.5rem;
              background-color: transparent;

              @include phone-width {
                width: 100%;
                height: 2.25rem;
              }

              :deep(.q-field__control) {
                height: 1.5rem;

                @include phone-width {
                  height: 2.25rem;

                  &::before {
                    border: 1px solid #cacaca;
                  }
                }

                .q-field__native {
                  width: 100%;
                  height: 100%;
                  font-family: Songti TC;
                  padding: 0;
                  color: black;

                  @include phone-width {
                    padding: 0.59375rem 0.5rem;
                  }

                  &::placeholder {
                    color: #797979;
                  }
                }

                .q-field__append {
                  padding: 0;

                  @include phone-width {
                    padding: 0 0.5rem 0 0;
                  }
                }
              }
            }

            :deep(.q-field__control) {
              padding: 0;
              height: 2.75rem;
              background: transparent;
              box-shadow: none;

              &::before {
                border: none;
              }

              .q-field__native {
                color: #797979;
                padding: 0.625rem 0.875rem;
                padding-right: 0;
                font-size: 0.875rem;
              }

              .q-field__append {
                height: 100%;

                .q-icon {
                  color: #6d7693;
                  width: 1.5rem;
                  height: 1.5rem;
                }
              }
            }
          }
        }

        .search-btn-area {
          display: flex;
          align-items: flex-end;

          @include phone-width {
            width: 100%;
          }

          .search-btn {
            background: #025be8;
            border-radius: 6.25rem;
            padding: 0.625rem 1.25rem;

            @include phone-width {
              width: 100%;
            }
          }
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.25rem;
    }
  }

  :deep(.q-table) {
    thead {
      color: rgba(0, 0, 0, 0.7);
    }

    tbody {
      color: #4a4a4a;
    }

    th {
      font-size: 1.125rem;
      padding-top: 0.59375rem;
      padding-bottom: 0.59375rem;
      text-align: center;
    }

    td {
      font-size: 1rem;
      padding-top: 0.6875rem;
      padding-bottom: 0.6875rem;
      text-align: center;
    }
  }

  :deep(.q-table__bottom) {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    color: #4a4a4a;
  }

  .expansion-menu {
    font-size: 12px;
    font-weight: 500;
    background-color: white;
    border-top-left-radius: 0.625rem;
    border-top-right-radius: 0.625rem;

    .expansion-item {
      background-color: white;
      border: 0.0625rem solid #0162ec;
      border-radius: 0.625rem;
      overflow: hidden;
      margin-bottom: 1.25rem;
    }

    :deep(.q-item) {
      padding: 0.625rem 1rem;
    }

    .expansion-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: self-start;

      &-top {
        width: 100%;
        display: flex;
        align-items: self-start;
        justify-content: space-between;
        color: black;
      }

      &-bottom {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        color: black;

        .operating-btn {
          color: #0295e8;
          cursor: pointer;
        }
      }

      .text-gray {
        color: rgba(20, 20, 20, 0.4);
        margin-top: 0.375rem;
      }
    }

    .expansion-detail {
      width: 100%;
      background: #5c8cf0;
      color: #fff;
      border-radius: 0.25rem;
      font-size: 0.625rem;
      font-weight: 700;

      .expansion-detail-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border-top: 0.0625rem solid rgba(255, 255, 255, 0.2);

        &:first-child {
          border-top: none;
        }
      }
    }
  }
}

.amount-dialog {
  min-width: 37.5rem;
  max-width: none;
  padding: 1.875rem;
  background-color: white;
  color: black;

  @include phone-width {
    width: 100%;
    min-width: unset;
    padding: 1rem;
  }

  .amount-dialog-header {
    width: 100%;
    font-size: 1rem;
    font-weight: 700;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.34375rem;

    :deep(.q-btn) {
      width: 1.25rem;
      height: 1.25rem;

      .q-btn__content {
        height: 1.25rem;
      }
    }
  }

  .amount-dialog-content {
    font-size: 0.875rem;
    font-weight: 400;
    padding: 0;

    .account {
      margin-bottom: 0.625rem;
    }

    .amount {
      color: #ededed;
      border-radius: 0.625rem;
      background-color: #f0f1f4;
      border-color: transparent;

      :deep(.q-field__control) {
        &::before {
          border: none;
        }
      }

      :deep(.q-field__native) {
        color: black;
        &::placeholder {
          color: #797979;
        }
      }
    }
  }

  .amount-dialog-actions {
    padding: 0;

    .confirm-btn {
      width: 100%;
      padding: 0.625rem 0;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      background: #025be8;
      color: white;

      :deep(.q-btn__content) {
        line-height: normal;
      }
    }
  }
}
</style>
