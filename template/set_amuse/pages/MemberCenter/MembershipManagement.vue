<template>
  <div class="management-area">
    <div class="top-item">
      <q-tabs
        v-model="activeTab"
        class="tabs-area"
        indicator-color="transparent"
        @update:model-value="handlerChangeActiveTab"
      >
        <q-tab name="manage" :label="$t('menu.membershipManagement')" class="tab-item left" />
        <q-tab name="detail" :label="$t('menu.memberChangeDetails')" class="tab-item" />
      </q-tabs>

      <div v-if="activeTab === 'manage'" class="flex flex-col justify-between items-center">
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
        <span class="text-white text-md font-semibold mt-4"
          >{{ `${$t("collaboration.remaining_agent_amount")}：` }}
          <span class="text-[#FFEB3B] text-2xl font-semibold">{{ `${moneyFormat(remainQuotaAmount)}` }}</span></span
        >
      </div>

      <q-form v-else @submit.prevent="handlerSearchAccountAmount" class="search-form">
        <div class="search-form-row">
          <div class="search-item">
            <div class="search-item-label">{{ $t("placeholder.pleaseEnterUserAccount") }}</div>
            <q-input
              v-model="memberAccount"
              :placeholder="$t('placeholder.pleaseEnterUserAccount')"
              dense
              standout="bg-grey-10 text-white"
              class="search-item-input"
            />
          </div>

          <div class="search-item">
            <div class="search-item-label">{{ $t("placeholder.pleaseSelectDate") }}</div>
            <q-input
              v-model="formattedDateRange"
              :placeholder="$t('placeholder.pleaseSelectDate')"
              readonly
              dense
              standout="bg-grey-10 text-white"
              class="search-item-input date"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" />
              </template>
              <q-menu ref="menuRef">
                <q-date v-model="dateRange" mask="YYYY-MM-DD" range minimal @range-end="hideMenu" />
              </q-menu>
            </q-input>
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
              standout="bg-grey-10 text-white"
              class="search-item-input"
            />
          </div>

          <div xs="12" sm="2" class="search-btn-area">
            <q-btn
              :label="$t('common.btn.searchBtn')"
              color="black"
              text-color="white"
              unelevated
              class="search-btn"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </div>

    <q-tab-panels v-model="activeTab" class="bg-transparent">
      <q-tab-panel name="manage" class="manage-panel">
        <!-- pc data -->
        <q-table
          v-if="!isMobile"
          table-class="bg-[#222222] text-white"
          table-header-class="bg-black text-white"
          :rows="manageRows"
          :rows-per-page-options="[size]"
          :columns="manageColumns"
          row-key="id"
          hide-pagination
          wrap-cells
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
                  class="text-[#ED772E] font-bold cursor-pointer mr-4"
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
                  class="text-[#ED772E] font-bold cursor-pointer"
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
            >
              <template v-slot:header>
                <q-item-section class="expansion-header">
                  <div class="expansion-header-left">
                    <div class="mb-2.5">
                      <span>{{ `${$t("menu.account")}：` }}</span>
                      <span class="ml-1">{{ data.member_account }}</span>
                    </div>
                    <div class="flex items-center justify-start">
                      <span>{{ `${$t("common.btn.point")}：` }}</span>
                      <span class="text-yellow ml-1">{{ moneyFormat(data.balance) }}</span>
                    </div>
                  </div>
                  <div class="expansion-header-right flex-col !items-start">
                    <div class="flex items-center justify-start">
                      <span> {{ `${$t("tableHeader.operating")}：` }}</span>
                      <div class="font-bold ml-1 text-xs">
                        <span
                          class="operating-btn mr-4"
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
                    <div class="flex items-center justify-start mt-2.5">
                      <span>{{ `${$t("tableHeader.balance")}：` }}</span>
                      <span class="text-yellow ml-1">{{ moneyFormat(data.remain_quota_amount) }}</span>
                    </div>
                  </div>
                </q-item-section>
              </template>

              <q-card>
                <q-card-section>
                  <div class="expansion-detail">
                    <div class="mb-[0.8125rem]">
                      <div class="mb-1">{{ $t("tableHeader.registerTime") }}</div>
                      <div>{{ parseDate(data.register_date) }}</div>
                    </div>
                    <div>
                      <div class="mb-1">{{ $t("tableHeader.lastLoginTime") }}</div>
                      <div>{{ parseDate(data.last_login_date) }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <div v-else class="q-expansion-item flex justify-center items-center">
            <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
          </div>
        </div>

        <!-- pagination -->
        <div v-if="totalPage" class="flex justify-end mt-7 pagination rounded mr-4">
          <q-pagination
            v-model="page"
            :max="totalPage"
            direction-links
            push
            color="pagination"
            icon-prev="keyboard_double_arrow_left"
            icon-next="keyboard_double_arrow_right"
            @update:model-value="handleChangePage"
          />
        </div>
      </q-tab-panel>

      <q-tab-panel name="detail" class="detail-panel">
        <!-- pc data -->
        <q-table
          v-if="!isMobile"
          table-class="bg-[#222222] text-white"
          table-header-class="bg-black text-white"
          :rows="detailRows"
          :rows-per-page-options="[size]"
          :columns="detailColumns"
          row-key="id"
          hide-pagination
          wrap-cells
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
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
          <q-list v-if="detailRows.length">
            <q-expansion-item
              v-for="(data, index) in detailRows"
              :key="index"
              dense
              dense-toggle
              expand-separator
              expand-icon="keyboard_arrow_down"
            >
              <template v-slot:header>
                <q-item-section class="expansion-header">
                  <div class="expansion-header-left">
                    <div class="mb-2.5">
                      <span>{{ `${$t("menu.account")}：` }}</span>
                      <span class="ml-1">{{ data.member_account }}</span>
                    </div>
                    <div class="flex items-center justify-start">
                      <span>{{ `${$t("tableHeader.accountType")}：` }}</span>
                      <span class="ml-1">{{ searchTypeName(data.action_type) }}</span>
                    </div>
                  </div>
                  <div class="expansion-header-right !self-end">
                    <span>{{ `${$t("tableHeader.amount")}：` }}</span>
                    <span class="text-yellow ml-1">{{ moneyFormat(data.amount) }}</span>
                  </div>
                </q-item-section>
              </template>

              <q-card>
                <q-card-section>
                  <div class="expansion-detail">
                    <div class="expansion-detail-item">
                      <div class="mb-1">{{ $t("tableHeader.accountChangeTime") }}</div>
                      <div>{{ parseDate(data.updated_at_unix) }}</div>
                    </div>
                    <div class="expansion-detail-item">
                      <div class="mb-1">{{ $t("tableHeader.accountVariableObject") }}</div>
                      <div>{{ data.transaction_code }}</div>
                    </div>
                    <div class="expansion-detail-item">
                      <div class="mb-1">{{ $t("tableHeader.amountBeforeChanges") }}</div>
                      <div>{{ moneyFormat(data.before_balance) }}</div>
                    </div>
                    <div>
                      <div class="mb-1">{{ $t("tableHeader.amountAfterChange") }}</div>
                      <div>{{ moneyFormat(data.after_balance) }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
          <div v-else class="q-expansion-item flex justify-center items-center">
            <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
          </div>
        </div>

        <!-- pagination -->
        <div v-if="totalPage" class="flex justify-end mt-7 pagination rounded mr-4">
          <q-pagination
            v-model="page"
            :max="totalPage"
            direction-links
            push
            color="pagination"
            icon-prev="keyboard_double_arrow_left"
            icon-next="keyboard_double_arrow_right"
            @update:model-value="handleChangePage"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="showDialog" persistent :maximized="isMobile">
      <q-card class="amount-dialog">
        <q-card-section class="amount-dialog-header">
          <q-btn
            v-if="isMobile"
            icon="chevron_left"
            flat
            round
            dense
            class="mobile-icon"
            @click="showDialog = false"
            size="md"
          />
          <div>
            {{
              dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                ? $t("member.membershipManagement.agentAddition")
                : $t("member.membershipManagement.agentDeduction")
            }}
          </div>
          <q-btn v-if="!isMobile" icon="close" flat round dense @click="showDialog = false" size="md" />
        </q-card-section>

        <q-separator class="amount-dialog-line" />

        <q-card-section class="amount-dialog-content">
          <div class="account">
            <span class="mr-2.5">{{ $t("menu.userAccount") }}</span>
            <span class="text-[#EDEDED] text-base font-normal">
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

          <div class="flex items-center justify-start mt-1">
            <div class="mr-2.5">
              {{
                dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                  ? $t("member.membershipManagement.agentAddRemainingAmount")
                  : $t("member.membershipManagement.agentMinusRemainingAmount")
              }}
            </div>

            <span class="text-[#FFEB3B] text-lg font-semibold">{{ moneyFormat(remainQuotaAmount) }}</span>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="amount-dialog-actions">
          <q-btn :label="$t('common.btn.confirm2')" color="black" class="confirm-btn" @click="handlerClickSubmit()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { MEMBER_AGENT_QUOTA_BALANCE_TYPE } from "src/common/utils/constants"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useMemberManagement } from "src/common/composables/useMemberManagement"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { useRouter } from "vue-router"

const router = useRouter()
const { isCredit } = useEnv()
const { userInfo } = useUserInfo()
const { isMobile } = useMediaQuery()
const { copyMessage, moneyFormat } = useCommon()
const {
  activeTab,
  menuRef,
  referralCode,
  page,
  size,
  totalPage,
  showDialog,
  remainQuotaAmount,
  dialogType,
  targetAccount,
  dialogAmount,
  dialogIncreaseItem,
  dialogIncreaseItemOptions,
  memberAccount,
  dateRange,
  formattedDateRange,
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

onMounted(async () => {
  if (!isCredit.value || !userInfo.value.is_member_agent) {
    return router.push({ name: "HomePage" })
  }

  await handlerGetMemberAgentQuotaBalance()
  await handlerGetMemberAgentQuotaAmount()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "src/css/table.sass";
@import "src/css/form.sass";
@import "app/template/set_amuse/assets/css/menu.sass";
@import "app/template/set_amuse/assets/css/pagination.sass";

.management-area {
  width: 100%;

  @include phone-width {
    padding: 1.6875rem 0.75rem 20%;
  }

  .top-item {
    width: 100%;
    background-color: #000000;
    border-radius: 0.75rem;
    padding: 1.5rem 1.4375rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;

    @include phone-width {
      margin-bottom: 1.25rem;
    }

    .tabs-area {
      @include phone-width {
        width: 100%;

        :deep(.q-tabs__content) {
          justify-content: center;
        }
      }

      .tab-item {
        min-width: 10.75rem;
        border: 1px solid #777777;
        border-radius: 0.25rem;
        background-color: #000000;
        padding: 0.84375rem 0.5rem;
        font-weight: 500;
        font-size: 1rem;
        white-space: pre-wrap;

        @include phone-width {
          width: calc(50% - 0.5rem);
          min-width: unset;
          padding: 0.78125rem 0;
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
          margin-right: 2rem;

          @include phone-width {
            margin-right: 0.75rem;
          }
        }

        &.q-tab--active {
          border-color: #ed772e;
          color: #ed772e;
        }
      }
    }

    .referral-code-area {
      width: 34.375rem;
      height: 13.125rem;
      color: #ededed;
      border: 1px solid #deaf4a;
      border-radius: 0.625rem;
      background-color: rgba(255, 255, 255, 0.2);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0.75rem 0 0;
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
        border: 1px solid #5a5a5a99;
        border-radius: 0.5rem;
        background-color: #ffffff;

        @include phone-width {
          width: 100%;
        }

        .code-icon {
          color: #757575;

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

        :deep(.q-field__native) {
          color: black;
          padding: 0.75rem 0.8125rem;

          @include phone-width {
            padding: 0.625rem;
          }
        }
      }
    }

    .search-form {
      width: 100%;
      border-top: 1px solid #333333;
      margin-top: 1.75rem;
      padding-top: 1.5rem;

      .search-form-row {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        margin-bottom: 1.9375rem;

        @include phone-width {
          flex-direction: column;
          align-items: center;
          margin-bottom: 0;
        }

        .search-item {
          margin-right: 0.75rem;

          @include phone-width {
            width: 100%;
            margin-right: 0;
            margin-bottom: 1.3125rem;
          }

          .search-item-label {
            color: #ededed;
            font-weight: 400;
            font-size: 0.75rem;
            margin-bottom: 0.25rem;
          }

          .search-item-input {
            width: 11rem;
            color: #ededed;
            border-radius: 0.5rem;
            background-color: rgba(96, 96, 96, 0.24);
            border: 1px solid rgba(90, 90, 90, 0.6);

            @include phone-width {
              width: 100%;
            }

            &::placeholder {
              color: rgba(243, 243, 243, 0.6);
            }

            &.date {
              width: 22.1875rem;

              @include phone-width {
                width: 100%;
              }
            }

            :deep(.q-field__control) {
              padding: 0;
              height: 2.75rem;

              .q-field__native {
                color: #ededed;
                padding: 0.75rem;
                font-size: 0.75rem;
              }

              .q-field__append {
                height: 100%;
                margin-right: 0.8125rem;

                .q-icon {
                  color: #ededed;
                  width: 1.25rem;
                  height: 1.25rem;
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
            min-width: 5.5rem;
            height: 2.75rem;
            border: 1px solid #ec7d38;
            border-radius: 0.5rem;

            @include phone-width {
              width: 100%;
            }
          }
        }
      }
    }
  }

  .manage-panel,
  .detail-panel {
    width: 100%;
    padding: 0;
  }

  :deep(.q-table) {
    tbody {
      tr,
      td {
        border: 1px solid #e2b854;
      }
    }
  }

  :deep(.q-table__bottom) {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e2b854;
    background-color: #1c1e22;
    color: #ffffffb3;
  }

  .expansion-menu {
    font-size: 12px;
    font-weight: 500;

    :deep(.q-item) {
      padding: 0.75rem 1.125rem;
    }

    .expansion-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: self-start;

      &-left {
        color: #ededed;
      }

      &-right {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #ededed;

        .operating-btn {
          color: #ed772e;
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }

          &::before {
            content: "[";
            margin-right: 2px;
            color: #ededed;
          }

          &::after {
            content: "]";
            margin-left: 2px;
            color: #ededed;
          }
        }
      }

      .text-yellow {
        color: #fff042;
      }
    }

    .expansion-detail {
      background: #1f1f1f;
      color: #fff;
      border-radius: 0.25rem;
      padding: 0.75rem;
      font-size: 0.625rem;
      font-weight: 500;

      .expansion-detail-item {
        margin-bottom: 0.8125rem;
      }
    }
  }
}

.amount-dialog {
  min-width: 22.5rem;
  max-width: none;
  padding: 1.25rem;
  background-color: #202020;
  color: #ededed;

  @include phone-width {
    width: 100%;
    min-width: unset;
    padding: 1rem;
  }

  .amount-dialog-header {
    width: 100%;
    font-size: 1rem;
    font-weight: 700;
    padding: 0 0 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    @include phone-width {
      justify-content: center;
    }

    :deep(.q-btn) {
      width: 1.25rem;
      height: 1.25rem;

      .q-btn__content {
        height: 1.25rem;
      }
    }

    .mobile-icon {
      position: absolute;
      left: 0;
    }
  }

  .amount-dialog-line {
    background: #333333;
    margin-bottom: 1.25rem;
  }

  .amount-dialog-content {
    font-size: 0.75rem;
    font-weight: 400;
    padding: 0;

    .account {
      margin-bottom: 1.25rem;
    }

    .amount {
      color: #ededed;
      border-radius: 0.5rem;
      background-color: rgba(96, 96, 96, 0.24);
      border: 1px solid rgba(90, 90, 90, 0.6);

      :deep(.q-field__native) {
        color: #ededed;
        &::placeholder {
          color: rgba(243, 243, 243, 0.6);
        }
      }
    }
  }

  .amount-dialog-actions {
    margin-top: 1.25rem;
    padding: 0;

    .confirm-btn {
      padding: 0.65625rem 1.75rem;
      border: 1px solid #ec7d38;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;

      @include phone-width {
        width: 100%;
      }

      :deep(.q-btn__content) {
        line-height: normal;
      }
    }
  }
}

.increase-item {
  :deep(.q-field__label) {
    color: rgba(243, 243, 243, 0.6);
  }
}
</style>
