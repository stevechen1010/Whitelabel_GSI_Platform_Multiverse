import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { ERROR_CODE_TYPE } from "src/common/utils/constants"

declare module "axios" {
  export interface AxiosRequestConfig {
    /** API名稱，用於對應mock api */
    name?: string

    /** 是否使用 form data 格式傳送 */
    useFormData?: boolean

    /** 是否需要自動戴上 token，預設為 true */
    needToken?: boolean
  }
}

const { envData } = useEnv()
const { auth } = useAuth()
const { VITE_APP_BASE_API, VITE_APP_BASE_API_PATH, agentCode } = envData()
// axios 實例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: VITE_APP_BASE_API,
  timeout: 1000 * 10 // timeout時間，單位為毫秒
})

// request 攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    const { useFormData = false } = config
    if (useFormData) {
      config.headers["Content-Type"] = "multipart/form-data"
    }

    const { needToken = true } = config
    if (needToken) {
      const { access_token } = auth.value
      config.headers.Authorization = `Bearer ${access_token}`
    }
    if (process.env.NODE_ENV === "development") {
      config.headers["Agentcode"] = agentCode
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// response 攔截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status: httpStatusCode, data: httpResponseData } = response

    if (!httpResponseData) {
      return Promise.resolve({
        status: false,
        code: ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION,
        excode: undefined,
        msg: "response is empty.",
        data: null
      })
    }

    if (httpStatusCode !== 200) {
      const { error, excode } = httpResponseData
      const errorCode = error?.code ?? 0
      const errorMessage = error?.message ?? ""

      return Promise.resolve({
        status: false,
        code: errorCode,
        excode: excode || undefined,
        msg: errorMessage,
        data: error
      })
    }

    const { code, msg, data, excode } = httpResponseData
    return Promise.resolve({
      status: code === ERROR_CODE_TYPE.Enums.SUCCESS,
      msg,
      code,
      excode: excode || undefined,
      data: data || null
    })
  },
  (error: any) => {
    return Promise.resolve({
      status: false,
      msg: error?.response?.data?.msg || error?.message,
      code: error?.response?.data?.code || error?.code || ERROR_CODE_TYPE.Enums.SERVER_EXCEPTION,
      excode: error?.response?.data?.excode || undefined,
      data: error?.response?.data || error
    })
  }
)

export const requestApi = async <RequestData, ResponseData>(
  url: string,
  params: RequestData,
  config: AxiosRequestConfig
): Promise<ResponseData> => {
  try {
    // 構建配置項
    const requestConfig: AxiosRequestConfig = {
      ...config,
      method: config.method,
      url,
      [config.method && config.method.toLowerCase() === "get" ? "params" : "data"]: params
    }

    const response = await axiosInstance.request<RequestData, ResponseData>(requestConfig)
    return response
  } catch (error) {
    throw new Error("Failed to fetch data")
  }
}
