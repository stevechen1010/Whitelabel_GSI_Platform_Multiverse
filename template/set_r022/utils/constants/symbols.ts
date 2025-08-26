import type { ComputedRef, InjectionKey } from "vue"
import type { GAME_TAG_TYPE } from "src/common/utils/constants"
import type * as Response from "src/api/response.type"

type SearchState = {
  gameList: Response.GameList
  favouriteGameList: Response.GameList
  keyword: string
  isFocus: boolean
  tag: GAME_TAG_TYPE.Enums
}

type tagItem = {
  label: string
  value: GAME_TAG_TYPE.Enums
  icon: string
  iconName: string
}

export interface SearchGame {
  gameTagList: ComputedRef<tagItem[]>
  searchState: SearchState
  filterGameList: ComputedRef<Response.GameList>
  handleTagClick: (value: GAME_TAG_TYPE.Enums, pup?: boolean) => void
}

export const SearchGameKey: InjectionKey<SearchGame> = Symbol("SearchGame")
