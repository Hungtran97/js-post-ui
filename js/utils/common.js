export function truncateText(text, maxLenght) {
  if (text.lenght < maxLenght) return text
  return `${text.slice(0, maxLenght - 1)}…`
}
export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}
export function upadateBackgroundImageUrl(elementId, url) {
  const element = document.getElementById(elementId)
  if (!element) return
  element.style.backgroundImage = `url(${url})`
}
export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}
