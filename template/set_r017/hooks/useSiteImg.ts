export function useSiteImg() {
  const resultImages = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

  /** 遊戲tag圖片 */
  const hotTagImg = resultImages("tags/hottag.png")
  const newTagImg = resultImages("tags/newtag.png")

  /** AI 圖片 */
  const aiIcon = (iconName: string) => resultImages(`ai/${iconName}.png`)

  const svgIcon = (iconName: string) => resultImages(`svg/${iconName}.svg`)
  const proxyImg = (file: string) => resultImages(`proxy/${file}`)
  const productLobbyImg = (file: string) => resultImages(`productLobby/${file}.png`)

  const menuIcon = (iconName: string, folder: "normal" | "active" = "normal") => {
    if (folder === "active") {
      return resultImages(`svg/active/${iconName}.svg`)
    } else {
      return resultImages(`svg/${iconName}.svg`)
    }
  }

  // Rank board
  const rankIcon = () => resultImages(`rankBoard/rank_icon.png`)
  const betDetailIcon = () => resultImages(`rankBoard/icon_bet_detail.png`)

  // ai agent
  const aiAgentBalanceImg = resultImages(`aiAgent/balance.png`)
  const aiAgentImg = (iconName: string) => resultImages(`aiAgent/${iconName}.png`)
  const aiAgentDesktopTitleImg = resultImages(`aiAgent/desktop_title.png`)

  return {
    /** 遊戲tag圖片 */
    hotTagImg,
    newTagImg,

    /** ai 圖片 */
    aiIcon,

    /** ai agent 圖片 */
    aiAgentBalanceImg,
    aiAgentImg,
    aiAgentDesktopTitleImg,
    /** svg 圖片 */
    svgIcon,

    /** 代理詳情入口 */
    proxyImg,

    /** 產品大廳圖片 */
    productLobbyImg,

    /** 左側選單icon */
    menuIcon,

    /** Rank board */
    rankIcon,
    betDetailIcon
  }
}
