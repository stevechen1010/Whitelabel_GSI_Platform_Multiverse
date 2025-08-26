import { requestApi } from "src/common/utils/request"
import * as Request from "./request.type"
import * as Response from "./response.type"

export const getCmsList = (params: Request.GetCmsList) => {
  return requestApi<Request.GetCmsList, Response.CmsList>("/v1/player/cms/detail/list", params, {
    name: "getCmsList",
    method: "get"
  })
}

export const getCmsDetail = (id: number) => {
  return requestApi<null, Response.CmsItem>(`/v1/player/cms/detail/${id}`, null, {
    name: "getCmsDetail",
    method: "get"
  })
}
