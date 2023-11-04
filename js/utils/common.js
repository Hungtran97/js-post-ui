export function truncateText (text, maxLenght) {
    if (text.lenght < maxLenght) return text
    return `${text.slice(0, maxLenght - 1)}…`
}
export function setTextContent(parent, selector, text) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.textContent = text
}