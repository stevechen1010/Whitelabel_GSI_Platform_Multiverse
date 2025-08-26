function openLink() {
  const deepLink = "paymaya://lucky_games?partner=7805"
  const appStoreUrl = "https://apps.apple.com/ph/app/paymaya/id971004531"
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.paymaya"
  const userAgent = navigator.userAgent

  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
  const isAndroid = /android/i.test(userAgent)

  if (!isIOS && !isAndroid) {
    window.open(deepLink, "_blank")
    return
  }

  const storeUrl = isIOS ? appStoreUrl : playStoreUrl

  const timer = setTimeout(() => {
    window.location.href = storeUrl
  }, 1500)

  function onLeave() {
    clearTimeout(timer)
    window.removeEventListener("blur", onLeave)
    window.removeEventListener("pagehide", onLeave)
  }

  window.addEventListener("blur", onLeave)
  window.addEventListener("pagehide", onLeave)

  window.location.href = deepLink
}

document.addEventListener("DOMContentLoaded", function () {
  openLink()
  const promoContainer = document.querySelector(".promo-container")
  if (promoContainer) {
    promoContainer.addEventListener("click", openLink)
  }
})
